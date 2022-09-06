import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';

export interface EndUserProps extends MutationObserverInit {
    /**
     * Name of event to emit / dispatch when content mutates
     */
     dispatchInfo?: string;
     forBs?: boolean;
     matchActions?: {[key: string]: MatchAction};
}

export interface VirtualProps extends EndUserProps, MinimalProxy {
}

export type Proxy = Element & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy;
}

export type PP = ProxyProps;

export interface MatchAction{
    dispatchInfo: string;
}

export interface Actions{
    onWatchForBs(pp: PP): void;
    addObserver(pp: PP): void;
    removeObserver(): void;
    finale(proxy: Proxy, target: Element, beDecor: BeDecoratedProps): void;
}

export interface Controller{
    proxy: Proxy;
}