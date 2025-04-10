import { FC } from 'react';

interface IconArrowProps {
    className?: string;
    fill?: string;
    stroke?: string;
}

const IconAltArrow: FC<IconArrowProps> = ({ className, fill = 'white', stroke = 'white' }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill={fill} className={className} xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5L15 12L9 19" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    );
};

export default IconAltArrow;
