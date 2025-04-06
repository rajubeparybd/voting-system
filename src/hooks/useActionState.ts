import { useState } from 'react';

type ActionState = {
    success: boolean;
    message: string;
};

type ServerAction<T> = (prevState: T, formData: FormData) => Promise<T>;

export function useActionState<T extends ActionState>(
    action: ServerAction<T>,
    initialState: T
): [T, (formData: FormData) => Promise<T>] {
    const [state, setState] = useState<T>(initialState);

    const actionWrapper = async (formData: FormData) => {
        const result = await action(state, formData);
        setState(result);
        return result;
    };

    return [state, actionWrapper];
}
