import { useState, useEffect} from "react";
import styled from "styled-components";
import { theme } from "../styles/theme";
import BookingForm from "../components/BookingForm";
import MapWithRoute from "../components/MapWithRoute";
import { Button } from "../components/Button";
import { useRef } from "react";

const Booking = () => {

  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [isValid, setIsValid] = useState(false);

  const [isButtonMounted, setIsButtonMounted] = useState(false);

  const [formValues, setFormValues] = useState({
    date: "",
    heure: "",
    depart: "",
    arrivee: "",
    typeTrajet: "",
    passagersAdultes: 1,
    passagersEnfants: 0,
  });

  const handleFormChange = (values: any) => {
    setFormValues(values);
    console.log("FormValues updated :", values)
    
  };

  useEffect(() => {
    if (buttonRef.current) {
      console.log("Button mounted successfully");
      setIsButtonMounted(true);
    }
    return () => setIsButtonMounted(false);
  }, []);


   // Effet pour le défilement
   useEffect(() => {
    console.log('useEffect triggered with formValues:', formValues);
    console.log('buttonRef.current:', buttonRef.current);

    // Met à jour l'état de validation
    const formIsValid = Boolean(
      formValues.date &&
      formValues.heure &&
      formValues.depart &&
      formValues.arrivee &&
      formValues.typeTrajet
    );
    setIsValid(formIsValid);

  if (formIsValid) {
      
    if (isButtonMounted && buttonRef.current) {
      console.log("Button is mounted, scrolling...");
      buttonRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    } else {
      console.log("Button not mounted yet, scheduling scroll...");
      const timer = setTimeout(() => {
        if (buttonRef.current) {
          buttonRef.current.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 500);
      return () => clearTimeout(timer);
    }  
      
  }
  }, [formValues, isButtonMounted]);

  const handleSubmit = (e?: React.MouseEvent<HTMLElement>) => {
    e?.preventDefault();
    if (isValid) {
      console.log("Formulaire soumis avec succès", formValues);
      // Ici, vous pouvez ajouter la logique de soumission du formulaire
    }
  };

  return (
   
      <Section>
        <H2>RESERVEZ UN VTC MAINTENANT</H2>
        <BookingContainer>
            <BookingFormContainer>
              <BookingForm
                onFormChange={handleFormChange}
              />
            </BookingFormContainer>
            <Maps>
                <MapWithRoute 
                  depart={formValues.depart} 
                  arrivee={formValues.arrivee} 
                />
            </Maps>
        </BookingContainer>       
          <Button
                ref={buttonRef}
                to="/Booking"
                variant="primary"
                size="large"
                disabled={!isValid}
                onClick={(e) => {
                  e?.preventDefault();
                  handleSubmit(e);
                }}
                type="button"
              
              >
                Choisir un véhicule
          </Button>
      </Section>
  
  )
}

const H2 = styled.h2`
  margin-top: 200px;
  z-index: 2;
  @media (max-width: 480px) {
    margin-top: 200px;
  }
`

const Section = styled.section`
    position: relative;
    box-sizing: border-box;
    max-width: 1440px;
    width: 100%;
    height: 100%;
    margin: auto;
    padding: 0 10px 20px;
    text-align: center;
    background: ${theme.colors.background}; 
    display: flex;
    flex-direction: column; 
    justify-content: center;
    align-items: center;
    gap: 2rem;
    color: white;
    margin-top: -150px;
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5); /* Fond noir à 50% d'opacité */
        z-index: 1;
  }
`
const BookingContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    z-index: 2;
    @media (max-width: 768px) {
        flex-direction: column;
    }
`

const BookingFormContainer = styled.div`
    width: 40%;
    height: 650px;
    overflow-y: auto;
    border: 20px solid #fff;
    border-radius: 10px;
    @media (max-width: 768px) {
        width: 80%;
        min-height: auto;
        height: auto;
    }
`

const Maps = styled.div`
    width: 40%;
    height: 650px;
    background: white;
    border-radius: 10px;
    border: 20px solid #fff;
    z-index: 2;
    @media (max-width: 768px) {
        width: 80%;
    }
`

export default Booking
