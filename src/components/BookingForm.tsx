import { useEffect } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import styled from 'styled-components';

const ReservationSchema = Yup.object().shape({
  date: Yup.date().required("Date obligatoire"),
  heure: Yup.string().required("Heure obligatoire"),
  depart: Yup.string().required("Lieu de départ obligatoire"),
  arrivee: Yup.string().required("Lieu d'arrivée obligatoire"),
  typeTrajet: Yup.string().required("Choix type trajet obligatoire"),
  passagersAdultes: Yup.number().min(1, "Au moins 1 adulte").required("Obligatoire"),
  passagersEnfants: Yup.number().min(0, "Obligatoire"),
});

const FormContainer = styled.div`
  max-width: 50%;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 2;
  @media (max-width: 768px) {
    max-width: 90%;
    margin: 0 auto;
  }
`;

const SectionTitle = styled.h3`
  color: #333;
  margin-bottom: .5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #eee;
`;

const Row = styled.div`
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
    @media (max-width: 480px) {
        flex-direction: column;
    }
`;

const FormField = styled.div`
  flex: 1;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
  font-size: .9rem;
`;

const Input = styled(Field)`
  
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: .9rem;
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const Select = styled(Field)`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background-color: #357abd;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

type BookingFormProps = {
  onLieuChange: (depart: string, arrivee: string) => void;
};

const BookingForm = ({ onLieuChange }: BookingFormProps) => (
  <FormContainer>
    <Formik
      initialValues={{
        date: "",
        heure: "",
        depart: "",
        arrivee: "",
        typeTrajet: "aller_simple",
        passagersAdultes: 1,
        passagersEnfants: 0,
      }}
      validationSchema={ReservationSchema}
      onSubmit={(values, { resetForm }) => {
        console.log(values);
        alert("Reservation enregistrée");
        resetForm();
      }}
    >
      {({ errors, touched, setFieldValue, values }) => {
        useEffect(() => {
          onLieuChange(values.depart, values.arrivee);
        }, [values.depart, values.arrivee]);
      
        return (
        <Form>
          {/* Section 1: Détails du trajet */}
          <SectionTitle>Détails du trajet</SectionTitle>
          
          <Row>
            <FormField>
              <Label>Date de départ</Label>
              <Input type="date" name="date" />
              {errors.date && touched.date && (
                <ErrorMessage>{errors.date}</ErrorMessage>
              )}
            </FormField>
            <FormField>
              <Label>Heure de départ</Label>
              <Input type="time" name="heure" />
              {errors.heure && touched.heure && (
                <ErrorMessage>{errors.heure}</ErrorMessage>
              )}
            </FormField>
          </Row>

          <FormField>
            <Label>Lieu de départ</Label>
            <Input type="text" name="depart" placeholder="Adresse de départ" />
            {errors.depart && touched.depart && (
              <ErrorMessage>{errors.depart}</ErrorMessage>
            )}
          </FormField>

          <FormField>
            <Label>Lieu de destination</Label>
            <Input type="text" name="arrivee" placeholder="Adresse de destination" />
            {errors.arrivee && touched.arrivee && (
              <ErrorMessage>{errors.arrivee}</ErrorMessage>
            )}
          </FormField>

          <FormField>
            <Label>Type de trajet</Label>
            <Select 
                as="select" 
                name="typeTrajet"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFieldValue("typeTrajet", e.target.value)}
            >
              <option value="">Sélectionnez un type de trajet</option>
              <option value="aller_simple">Aller simple</option>
              <option value="aller_retour">Aller et retour</option>
            </Select>
            {errors.typeTrajet && touched.typeTrajet && (
              <ErrorMessage>{errors.typeTrajet}</ErrorMessage>
            )}
          </FormField>

          {/* Section 2: Nombre de passagers */}
          <SectionTitle>Nombre de passagers</SectionTitle>
          
          <Row>
            <FormField>
              <Label>Adultes</Label>
              <Input type="number" name="passagersAdultes" min="1" />
              {errors.passagersAdultes && touched.passagersAdultes && (
                <ErrorMessage>{errors.passagersAdultes}</ErrorMessage>
              )}
            </FormField>
            <FormField>
              <Label>Enfants</Label>
              <Input type="number" name="passagersEnfants" min="0" />
              {errors.passagersEnfants && touched.passagersEnfants && (
                <ErrorMessage>{errors.passagersEnfants}</ErrorMessage>
              )}
            </FormField>
          </Row>

          <SubmitButton type="submit">Réserver maintenant</SubmitButton>
        </Form>
)}}
    </Formik>
  </FormContainer>
);

export default BookingForm;
