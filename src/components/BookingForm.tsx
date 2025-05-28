import { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
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
  width: 100%;
  height: auto;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 2;
  
  @media (max-width: 768px) {
    width: 100%;
    margin: 0 auto;
  }
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  color: #333;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #eee;
  font-size: 1.1rem;
`;

const Row = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  
  @media (max-width: 1224px) {
    flex-direction: column;
  }
`;

const FormField = styled.div`
  flex: 1;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const Select = styled.select`
  ${Input}
  background-color: white;
  cursor: pointer;
`;

const ErrorText = styled.div`
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

// ... (les imports et styles restent les mêmes)

type BookingFormProps = {
 
  onFormChange: (values: any) => void;  // Nouvelle prop
};

const BookingForm = ({ onFormChange }: BookingFormProps) => {
  const [formValues, setFormValues] = useState({
    date: "",
    heure: "",
    depart: "",
    arrivee: "",
    typeTrajet: "",
    passagersAdultes: 1,
    passagersEnfants: 0,
  });

  // Effet pour déclencher les mises à jour
  useEffect(() => {
    onFormChange(formValues);
  }, [formValues, onFormChange]);

  return (
    <FormContainer>
      <Formik
        initialValues={formValues}
        validationSchema={ReservationSchema}
        onSubmit={() => {}}  // On garde la méthode vide car on ne soumet plus le formulaire
      >
        {({ values}) => {
          // Mise à jour des valeurs du formulaire
          useEffect(() => {
            setFormValues(values);
          
          }, [values]);

          return (
            <Form>
              {/* Le reste du formulaire reste inchangé */}
              <Section>
                <SectionTitle>Détails du trajet</SectionTitle>
                <Row>
                  <FormField>
                    <Label>Date de départ</Label>
                    <Field 
                      type="date" 
                      name="date" 
                      as={Input} 
                    />
                    <ErrorMessage name="date" component={ErrorText} />
                  </FormField>
                  <FormField>
                    <Label>Heure de départ</Label>
                    <Field 
                      type="time" 
                      name="heure" 
                      as={Input} 
                    />
                    <ErrorMessage name="heure" component={ErrorText} />
                  </FormField>
                </Row>
                
                <Row>
                  <FormField>
                    <Label>Lieu de départ</Label>
                    <Field 
                      type="text" 
                      name="depart" 
                      as={Input} 
                    />
                    <ErrorMessage name="depart" component={ErrorText} />
                  </FormField>
                  <FormField>
                    <Label>Lieu d'arrivée</Label>
                    <Field 
                      type="text" 
                      name="arrivee" 
                      as={Input} 
                    />
                    <ErrorMessage name="arrivee" component={ErrorText} />
                  </FormField>
                </Row>
              </Section>

              <Section>
                <SectionTitle>Passagers</SectionTitle>
                <Row>
                  <FormField>
                    <Label>Adultes</Label>
                    <Field 
                      type="number" 
                      name="passagersAdultes" 
                      min="1" 
                      as={Input} 
                    />
                    <ErrorMessage name="passagersAdultes" component={ErrorText} />
                  </FormField>
                  <FormField>
                    <Label>Enfants</Label>
                    <Field 
                      type="number" 
                      name="passagersEnfants" 
                      min="0" 
                      as={Input} 
                    />
                    <ErrorMessage name="passagersEnfants" component={ErrorText} />
                  </FormField>
                </Row>
              </Section>

              <Section>
                <SectionTitle>Type de trajet</SectionTitle>
                <FormField>
                  <Label>Type de trajet</Label>
                  <Field 
                    name="typeTrajet" 
                    as={Select}
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="simple">Simple</option>
                    <option value="aller-retour">Aller-retour</option>
                  </Field>
                  <ErrorMessage name="typeTrajet" component={ErrorText} />
                </FormField>
              </Section>
            </Form>
          );
        }}
      </Formik>
    </FormContainer>
  );
};

export default BookingForm;