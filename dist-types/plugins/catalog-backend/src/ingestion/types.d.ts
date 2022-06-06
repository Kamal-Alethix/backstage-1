import { Entity } from '@backstage/catalog-model';
import { RecursivePartial } from '../util/RecursivePartial';
import { LocationSpec } from '../api';
/** @public */
export declare type LocationAnalyzer = {
    /**
     * Generates an entity configuration for given git repository. It's used for
     * importing new component to the backstage app.
     *
     * @param location - Git repository to analyze and generate config for.
     */
    analyzeLocation(location: AnalyzeLocationRequest): Promise<AnalyzeLocationResponse>;
};
/** @public */
export declare type AnalyzeLocationRequest = {
    location: LocationSpec;
};
/** @public */
export declare type AnalyzeLocationResponse = {
    existingEntityFiles: AnalyzeLocationExistingEntity[];
    generateEntities: AnalyzeLocationGenerateEntity[];
};
/**
 * If the folder pointed to already contained catalog info yaml files, they are
 * read and emitted like this so that the frontend can inform the user that it
 * located them and can make sure to register them as well if they weren't
 * already
 * @public
 */
export declare type AnalyzeLocationExistingEntity = {
    location: LocationSpec;
    isRegistered: boolean;
    entity: Entity;
};
/**
 * This is some form of representation of what the analyzer could deduce.
 * We should probably have a chat about how this can best be conveyed to
 * the frontend. It'll probably contain a (possibly incomplete) entity, plus
 * enough info for the frontend to know what form data to show to the user
 * for overriding/completing the info.
 * @public
 */
export declare type AnalyzeLocationGenerateEntity = {
    entity: RecursivePartial<Entity>;
    fields: AnalyzeLocationEntityField[];
};
/** @public */
export declare type AnalyzeLocationEntityField = {
    /**
     * e.g. "spec.owner"? The frontend needs to know how to "inject" the field into the
     * entity again if the user wants to change it
     */
    field: string;
    /** The outcome of the analysis for this particular field */
    state: 'analysisSuggestedValue' | 'analysisSuggestedNoValue' | 'needsUserInput';
    value: string | null;
    /**
     * A text to show to the user to inform about the choices made. Like, it could say
     * "Found a CODEOWNERS file that covers this target, so we suggest leaving this
     * field empty; which would currently make it owned by X" where X is taken from the
     * codeowners file.
     */
    description: string;
};
