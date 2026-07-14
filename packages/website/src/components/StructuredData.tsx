import type { Thing, WithContext } from 'schema-dts';

interface StructuredDataProps {
    data: WithContext<Thing>;
}

/**
 * Server-side JSON-LD structured data component.
 * Renders a script tag with application/ld+json for search engines.
 */
export function StructuredData({ data }: StructuredDataProps) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
