

const SaveNameModal: React.FC<{
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onSave: () => void;
    projectName : string
    setProjectName : React.Dispatch<React.SetStateAction<string>>
}> = ({ isOpen, setIsOpen, onSave , setProjectName,projectName }) => {


    return (
        <div onClick={() => setIsOpen(true)}>
            zzzzzzzzzzzzzzzzzzzzzzzz
        </div>
    );
};

export default SaveNameModal;
