import React from 'react';
export declare type JokeType = 'any' | 'programming';
declare type Joke = {
    setup: string;
    punchline: string;
};
declare type RandomJokeContextValue = {
    loading: boolean;
    joke: Joke;
    type: JokeType;
    rerollJoke: Function;
    handleChangeType: Function;
};
declare const Context: React.Context<RandomJokeContextValue | undefined>;
export declare const ContextProvider: (props: {
    children: JSX.Element;
    defaultCategory?: JokeType;
}) => JSX.Element;
export declare const useRandomJoke: () => RandomJokeContextValue;
export default Context;
