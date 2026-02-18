import { useEffect, useState, useRef } from "react";
import { Formik, Field, Form, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from "react-icons/fa";

import type { BookingInfo } from "../types/booking";

const libraries: ("places")[] = ["places"];

// Define the type for the form values based on BookingInfo, omitting 'vehicule'
export type FormikValues = Omit<BookingInfo, "vehicule">;

const ReservationSchema = Yup.object().shape({
    date: Yup.date().required("Date obligatoire"),
    heure: Yup.string().required("Heure obligatoire"),
    depart: Yup.string().required("Lieu de départ obligatoire"),
    arrivee: Yup.string().required("Lieu d'arrivée obligatoire"),
    typeTrajet: Yup.string().required("Choix type trajet obligatoire"),
});

const FormContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 2;
    background: white;
    box-sizing: border-box;
    @media (max-width: 768px) {
        width: 100%;
        margin: 0 auto;
    }
`;

const StyledForm = styled(Form)`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
`;


const Row = styled.div`
    display: flex;
    gap: 0.75rem;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const FormField = styled.div`
    flex: 1;
    position: relative;
`;

const FullWidthFormField = styled.div`
    width: 100%;
    position: relative;
    flex: 1;
    box-sizing: border-box;
`;

const InputWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
`;

const AutocompleteWrapper = styled.div`
    width: 100%;
    box-sizing: border-box;
    
    & > div {
        width: 100% !important;
    }
`;

const IconWrapper = styled.div`
    position: absolute;
    left: 1rem;
    color: #666;
    display: flex;
    align-items: center;
    pointer-events: none;
    z-index: 1;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.75rem 0.75rem 0.75rem 2.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.95rem;
    background-color: #f8f9fa;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: #4a90e2;
        box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
        background-color: white;
    }

    &::placeholder {
        color: #999;
    }
`;

const Select = styled.select`
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.95rem;
    background-color: #f8f9fa;
    cursor: pointer;

    &:focus {
        outline: none;
        border-color: #4a90e2;
        box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
        background-color: white;
    }
`;

const ErrorText = styled.div`
    color: #e74c3c;
    font-size: 0.875rem;
    margin-top: 0.25rem;
`;

/**
 * Champ Autocomplete (Google Places) intégré à Formik.
 *
 * Met à jour la valeur Formik du champ `name` lorsque l'utilisateur sélectionne
 * une adresse via Google Places.
 */
const PlacesAutocompleteField: React.FC<{
    name: string;
    placeholder?: string;
    isLoaded: boolean;
    icon: React.ReactNode;
}> = ({ name, placeholder, isLoaded, icon }) => {
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const { setFieldValue } = useFormikContext();

    /**
     * Callback appelé par le composant `<Autocomplete>` lorsque l'instance Google
     * Autocomplete est prête.
     */
    const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
        autocompleteRef.current = autocomplete;
    };

    /**
     * Callback appelé lorsque l'utilisateur change de place (sélection d'une adresse).
     * Si une adresse formatée est disponible, elle est poussée dans Formik.
     */
    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place.formatted_address) {
                setFieldValue(name, place.formatted_address);
            }
        }
    };

    if (!isLoaded) {
        return (
            <InputWrapper>
                <IconWrapper>{icon}</IconWrapper>
                <Field type="text" name={name} as={Input} placeholder={placeholder} />
            </InputWrapper>
        );
    }

    return (
        <InputWrapper>
            <IconWrapper>{icon}</IconWrapper>
            <AutocompleteWrapper>
                <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                    <Field type="text" name={name} as={Input} placeholder={placeholder} />
                </Autocomplete>
            </AutocompleteWrapper>
        </InputWrapper>
    );
};

/**
 * Observe les valeurs Formik et les synchronise avec l'état parent.
 *
 * Ce composant ne rend rien (pattern "observer").
 */
const FormikObserver: React.FC<{
    setFormValues: (values: FormikValues) => void;
}> = ({ setFormValues }) => {
    const { values } = useFormikContext<FormikValues>();
    useEffect(() => {
        setFormValues(values);
    }, [values, setFormValues]);

    return null; // This component renders nothing
};

type BookingFormProps = {
    onFormChange: (values: FormikValues) => void;
};

/**
 * Formulaire de réservation (Formik) utilisé pour saisir les informations de trajet.
 *
 * Particularités:
 * - Utilise Google Places pour les champs `depart` et `arrivee`
 * - Ne soumet pas de formulaire (onSubmit vide), le parent récupère les valeurs via `onFormChange`
 */
const BookingForm: React.FC<BookingFormProps> = ({ onFormChange }) => {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
        libraries: libraries,
    });

    /**
     * Retourne la date du jour au format ISO court (YYYY-MM-DD) pour initialiser le champ date.
     */
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    /**
     * Retourne l'heure courante au format HH:MM pour initialiser le champ heure.
     */
    const getCurrentTime = () => {
        const now = new Date();
        return now.toTimeString().slice(0, 5);
    };

    const initialValues: FormikValues = {
        date: getTodayDate(),
        heure: getCurrentTime(),
        depart: "",
        arrivee: "",
        typeTrajet: "simple",
    };

    const [formValues, setFormValues] = useState(initialValues);

    useEffect(() => {
        onFormChange(formValues);
    }, [formValues, onFormChange]);

    return (
        <FormContainer>
            <Formik
                initialValues={formValues}
                validationSchema={ReservationSchema}
                onSubmit={() => {}} // On garde la méthode vide car on ne soumet plus le formulaire
            >
                {() => {
                    return (
                        <StyledForm>
                            <FormikObserver setFormValues={setFormValues} />

                            <FullWidthFormField>
                                <PlacesAutocompleteField
                                    name="depart"
                                    placeholder="Lieu de départ"
                                    isLoaded={isLoaded}
                                    icon={<FaMapMarkerAlt />}
                                />
                                <ErrorMessage
                                    name="depart"
                                    component={ErrorText}
                                />
                            </FullWidthFormField>

                            <FullWidthFormField>
                                <PlacesAutocompleteField
                                    name="arrivee"
                                    placeholder="Lieu d'arrivée"
                                    isLoaded={isLoaded}
                                    icon={<FaMapMarkerAlt />}
                                />
                                <ErrorMessage
                                    name="arrivee"
                                    component={ErrorText}
                                />
                            </FullWidthFormField>

                            <Row>
                                <FormField>
                                    <InputWrapper>
                                        <IconWrapper>
                                            <FaCalendarAlt />
                                        </IconWrapper>
                                        <Field
                                            type="date"
                                            name="date"
                                            as={Input}
                                        />
                                    </InputWrapper>
                                    <ErrorMessage
                                        name="date"
                                        component={ErrorText}
                                    />
                                </FormField>
                                <FormField>
                                    <InputWrapper>
                                        <IconWrapper>
                                            <FaClock />
                                        </IconWrapper>
                                        <Field
                                            type="time"
                                            name="heure"
                                            as={Input}
                                        />
                                    </InputWrapper>
                                    <ErrorMessage
                                        name="heure"
                                        component={ErrorText}
                                    />
                                </FormField>
                            </Row>

                            <FormField>
                                <Field name="typeTrajet" as={Select}>
                                    <option value="simple">Simple</option>
                                    <option value="aller-retour">
                                        Aller-retour
                                    </option>
                                </Field>
                                <ErrorMessage
                                    name="typeTrajet"
                                    component={ErrorText}
                                />
                            </FormField>
                        </StyledForm>
                    );
                }}
            </Formik>
        </FormContainer>
    );
};

export default BookingForm;
