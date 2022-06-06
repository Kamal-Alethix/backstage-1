import { ReactNode } from 'react';
declare type ItemCardProps = {
    description?: string;
    tags?: string[];
    title: string;
    /** @deprecated Use subtitle instead */
    type?: string;
    subtitle?: ReactNode;
    label: string;
    onClick?: () => void;
    href?: string;
};
/**
 * This card type has been deprecated. Instead use plain MUI Card and helpers
 * where appropriate.
 *
 * ```
 *   <Card>
 *     <CardMedia>
 *       <ItemCardHeader title="My Card" subtitle="neat!" />
 *     </CardMedia>
 *     <CardContent>
 *        Some text
 *     </CardContent>
 *     <CardActions>
 *       <Button color="primary" to="https://backstage.io">
 *         Get Started
 *       </Button>
 *     </CardActions>
 *   </Card>
 * ```
 *
 * @deprecated Use plain MUI `<Card>` and composable helpers instead.
 * @see https://material-ui.com/components/cards/
 */
export declare function ItemCard(props: ItemCardProps): JSX.Element;
export {};
