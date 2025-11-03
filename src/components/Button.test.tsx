import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button Component", () => {
    it("devrait rendre le bouton avec le texte correct", () => {
        render(<Button>Cliquez ici</Button>);

        const button = screen.getByText("Cliquez ici");
        expect(button).toBeInTheDocument();
    });

    it("devrait appeler onClick quand cliqué", () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Cliquez</Button>);

        const button = screen.getByText("Cliquez");
        fireEvent.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("devrait être désactivé quand disabled est true", () => {
        render(<Button disabled>Désactivé</Button>);

        const button = screen.getByText("Désactivé");
        expect(button).toBeDisabled();
    });

    it("devrait avoir la bonne classe CSS", () => {
        const { container } = render(
            <Button className="custom-class">Test</Button>
        );

        const button = container.querySelector("button");
        expect(button).toHaveClass("custom-class");
    });
});
