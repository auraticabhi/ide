import { FC } from 'react';

interface IconFolderProps {
    className?: string;
    stroke? : string
}

const IconList: FC<IconFolderProps> = ({ className , stroke = 'currentColor' }) => {
    return (
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.66663 4.25H14.875" stroke={stroke} strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M5.66663 8.5H14.875" stroke={stroke} strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M5.66663 12.75H14.875" stroke={stroke} strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M2.125 4.25H2.13208" stroke={stroke} strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M2.125 8.5H2.13208" stroke={stroke} strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M2.125 12.75H2.13208" stroke={stroke} strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

    );
};

export default IconList;
