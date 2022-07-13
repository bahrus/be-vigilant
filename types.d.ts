import {BeDecoratedProps} from 'be-decorated/types';

export interface BeVigilantVirtualProps extends MutationObserverInit {
    /**
     * Name of event to emit / dispatch when content mutates
     */
    dispatchInfo?: string;
    forBs?: boolean;
    matchActions?: {[key: string]: MatchAction};
}

export interface BeVigilantProps extends BeVigilantVirtualProps {
    proxy: Element & BeVigilantVirtualProps;
}

export interface MatchAction{
    dispatchInfo: string;
}

export interface BeVigilantActions{
    intro(proxy: Element & BeVigilantVirtualProps, target: Element, beDecor: BeDecoratedProps): void;
    onWatchForBs(self: this): void;
    addObserver(self: this): void;
    removeObserver(self: this): void;
    finale(proxy: Element & BeVigilantVirtualProps, target: Element, beDecor: BeDecoratedProps): void;
}