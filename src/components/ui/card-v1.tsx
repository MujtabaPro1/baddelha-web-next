import { memo } from 'react';

const Card = memo(function Card({ as: Comp = 'article', className = '', children, ...props }: any) {
  return (
    <Comp className={`rounded-xl bg-white p-5 shadow-soft ring-1 ring-slate-200 ${className}`.trim()} {...props}>
      {children}
    </Comp>
  );
});

export default Card;