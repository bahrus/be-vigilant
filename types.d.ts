import {BeDecoratedProps} from 'be-decorated/types';

export interface BeVigilantVirtualProps extends MutationObserverInit {
    asType: string;
}

export interface BeVigilantProps extends BeVigilantVirtualProps {
    proxy: Element & BeVigilantVirtualProps;
}

export interface BeVigilantActions{
    intro(proxy: Element & BeVigilantVirtualProps, target: Element, beDecor: BeDecoratedProps): void;
    addObserver(self: this): void;
    removeObserver(self: this): void;
    finale(proxy: Element & BeVigilantVirtualProps, target: Element, beDecor: BeDecoratedProps): void;
}