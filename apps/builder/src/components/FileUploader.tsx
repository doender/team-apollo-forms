import React, { FC, FormEvent, ReactElement } from 'react';

interface FileUploaderProps {
    onFilesSelected: (files: FileList) => void;
    component: ({ onClick }: { onClick: () => void }) => ReactElement;
    accept?: string;
}

const FileUploader: FC<FileUploaderProps> = ({ onFilesSelected, component, accept }) => {
    const Component = component;
    const hiddenFileInput = React.useRef<HTMLInputElement>(null);

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    const handleChange = (event: FormEvent<HTMLInputElement>) => {
        const fileUploaded = event.currentTarget.files;
        onFilesSelected(fileUploaded);
    };

    return (
        <>
            <Component onClick={handleClick} />
            <input
                type="file"
                accept={accept}
                ref={hiddenFileInput}
                onChange={(e) => {
                    handleChange(e);
                    e.target.value = null;
                }}
                style={{ display: 'none' }}
            />
        </>
    );
};
export default FileUploader;
