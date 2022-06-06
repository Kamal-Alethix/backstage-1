/**
 *  This is a mocking method suggested in the Jest docs, as it is not implemented in JSDOM yet.
 *  It can be used to mock values for the MUI `useMediaQuery` hook if it is used in a tested component.
 *
 *  For issues checkout the documentation:
 *  https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
 *
 *  If there are any updates from MUI React on testing `useMediaQuery` this mock should be replaced
 *  https://material-ui.com/components/use-media-query/#testing
 *
 * @public
 */
export default function mockBreakpoint(options: {
    matches: boolean;
}): void;
