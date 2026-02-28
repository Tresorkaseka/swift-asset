export const optimizeSVG = async (svgString: string): Promise<string> => {
    // Simulate heavy processing for WOW effect later
    await new Promise(resolve => setTimeout(resolve, 500));

    let cleaned = svgString
        .replace(/<\?xml.*?\?>/gi, '')
        .replace(/<!DOCTYPE.*?>/gi, '')
        .replace(/<!--.*?-->/g, '')
        .trim();

    // Basic cleanup of attributes that React doesn't like or or redundant metadata
    cleaned = cleaned.replace(/xmlns:xlink=".*?"/g, '');
    cleaned = cleaned.replace(/xml:space=".*?"/g, '');

    return cleaned;
};

export const convertToReactComponent = (svgString: string, componentName: string = 'Icon'): string => {
    // Convert kebab-case attributes to camelCase for React
    let jsx = svgString.replace(/([a-z0-9])-([a-z])/g, (g) => g[0] + g[2].toUpperCase());

    // Special case for class -> className
    jsx = jsx.replace(/class=/g, 'className=');

    return `import React from 'react';

export const ${componentName} = (props: React.SVGProps<SVGSVGElement>) => (
  ${jsx.replace('<svg', '<svg {...props}')}
);`;
};
