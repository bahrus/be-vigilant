import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';
import {
    EndUserProps as BeWatchingEndUserProps,
    VirtualProps as BeWatchingVirtualProps,
} from 'be-watching/types';

export interface EndUserProps extends BeWatchingEndUserProps {
    /**
     * Name of event to emit / dispatch when content mutates
     */
     dispatchInfo?: string;
     forBs?: boolean;
     matchActions?: {[key: string]: MatchAction};
}

export interface VirtualProps extends EndUserProps, BeWatchingVirtualProps {}

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
}
