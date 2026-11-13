import * as react from 'react';

declare function useTypewriter(text: string, speed?: number): {
    shown: string;
    done: boolean;
    finish: () => void;
};
declare function Dialogue({ npcId, onClose }: {
    npcId: string;
    onClose: () => void;
}): react.JSX.Element;

type DialogueProps = {
    npcId: string;
    onClose: () => void;
};
type TypewriterResult = {
    shown: string;
    done: boolean;
    finish: () => void;
};

export { Dialogue, Dialogue as default, useTypewriter };
export type { DialogueProps, TypewriterResult };
