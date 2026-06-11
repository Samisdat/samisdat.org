import React from 'react';

export const FontAwesomeIcon = React.forwardRef((props: any, ref: any) => {
  return React.createElement('i', {
    ref,
    className: `fa ${props.icon?.iconName || ''}`,
    ...props,
  });
});

FontAwesomeIcon.displayName = 'FontAwesomeIcon';
