import { FC } from 'react';

interface IconArrowDownwardProps {
    className?: string;
    fill? : string
}

const IconArrowDownward: FC<IconArrowDownwardProps> = ({ className , fill="#1C274C" }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M19 9L12 15L5 9" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export default IconArrowDownward;
