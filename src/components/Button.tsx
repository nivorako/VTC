import * as React from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonBaseProps {
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  to?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  as?: React.ElementType;
  $variant?: never; // Empêche l'utilisation directe de ces props
}

const getVariantStyles = (variant: ButtonVariant) => {
    switch (variant) {
      case 'secondary':
        return `
          background: ${theme.colors.secondary};
          color: white;
          &:hover {
            background: ${theme.colors.tertiary};
          }
        `;
      case 'outline':
        return `
          background: transparent;
          border: 2px solid ${theme.colors.primary};
          color: ${theme.colors.primary};
          &:hover {
            background: ${theme.colors.primary};
            color: white;
          }
        `;
      case 'text':
        return `
          background: transparent;
          color: ${theme.colors.primary};
          padding: 0.5rem 1rem;
          &:hover {
            text-decoration: underline;
          }
        `;
      case 'primary':
      default:
        return `
          background: ${theme.colors.primaryDark};
          color: white;
          &:hover {
            background: ${theme.colors.primary};
          }
        `;
    }
  };

  const getSizeStyles = (size: ButtonSize) => {
    switch (size) {
      case 'small':
        return 'padding: 0.5rem 1rem; font-size: 0.875rem;';
      case 'large':
        return 'padding: 1rem 2rem; font-size: 1.25rem;';
      case 'medium':
      default:
        return 'padding: 0.75rem 1.5rem;';
    }
  };
const ButtonBase = styled.button<ButtonBaseProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  text-align: center;
  white-space: nowrap;
  z-index: 2;
  ${({ $variant }) => getVariantStyles($variant)}
  ${({ $size }) => getSizeStyles($size)}
  ${({ $fullWidth }) => $fullWidth && 'width: 100%;'}

  ${({ disabled }) => disabled && `
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  `}
`;

const LinkButton = React.forwardRef<HTMLAnchorElement, ButtonBaseProps & { to: string }>(({ 
  children, 
  ...props 
}, ref) => {
  return (
    <StyledLink 
      ref={ref} 
      {...props}
    >
      {children}
    </StyledLink>
  );
});
LinkButton.displayName = 'LinkButton';


const StyledLink = styled(Link).withConfig({
  shouldForwardProp: (prop) => !['$variant', '$size', '$fullWidth'].includes(prop),
})<ButtonBaseProps>`
  ${({ $variant }) => getVariantStyles($variant)}
  ${({ $size }) => getSizeStyles($size)}
  ${({ $fullWidth }) => $fullWidth && 'width: 100%;'}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  white-space: nowrap;
  z-index: 2;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Button = React.forwardRef<HTMLButtonElement |  HTMLAnchorElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'medium',
  to,
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
  className,
}, ref) => {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };
  const commonProps = {
    $variant: variant,
    $size: size,
    $fullWidth: fullWidth,
    className,
    onClick: handleClick,
    type: to ? undefined : type,
    disabled: to ? undefined : disabled,
  };

  if (to) {
    return (
      <LinkButton
        to={to}
        {...commonProps}
        ref={ref as React.RefObject<HTMLAnchorElement>}
        style={disabled ? { pointerEvents: 'none', opacity: 0.6, cursor: 'not-allowed' } : {}}
      >
        {children}
      </LinkButton>
    );
  }

  return (
    <ButtonBase 
      ref={ref as React.RefObject<HTMLButtonElement>}
      {...commonProps}
    >
      {children}
    </ButtonBase>
  );
});