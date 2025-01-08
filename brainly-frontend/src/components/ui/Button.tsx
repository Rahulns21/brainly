import { ReactElement } from "react";

type sizeOptions = "sm" | "md" | "lg";
type variantOptions = "primary" | "secondary";

interface ButtonInterface {
    title: string;
    size: sizeOptions;
    variant: variantOptions;
    startIcon?: ReactElement;
    endIcon?: ReactElement;
}

const sizeStyles = {
    "sm": "px-2 py-1 rounded",
    "md": "px-4 py-2 rounded-md",
    "lg": "px-8 py-4 rounded-lg"
}

const variantStyles = {
    "primary": "bg-purple-600 text-white",
    "secondary": "bg-purple-400 text-white"
}

export function Button(props: ButtonInterface) {
    return <button className={`${sizeStyles[props.size]} ${variantStyles[props.variant]}`}>
        <div className="flex items-center">
            {props.startIcon}
            <div className="px-2">
                {props.title}
            </div>
            {props.endIcon}
        </div>
    </button>
}