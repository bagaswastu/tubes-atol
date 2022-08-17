import { Button, FileButton, Group } from '@mantine/core';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { IconTrash, IconUpload } from 'tabler-icons';

type Props = {
  photo: File | null;
  setPhoto: Dispatch<SetStateAction<File | null>>;
  isLoading: boolean;
};

const UploadContainer = ({ photo, setPhoto, isLoading }: Props) => {
  const resetRef = useRef<() => void>(null);

  function clearPhoto() {
    setPhoto(null);
    resetRef.current?.();
  }

  useEffect(() => {
    if (photo) {
      resetRef.current?.();
    }
  }, [photo]);

  function onChange(p: File) {
    if (!p) return;

    if (p.size > 3000000) {
      alert('Ukuran foto maksimal 3MB');
      return;
    }

    setPhoto(p);
  }

  return (
    <Group position="center" mt={20}>
      <FileButton
        resetRef={resetRef}
        onChange={onChange}
        accept="image/png,image/jpeg,image/jpg"
      >
        {(props) => (
          <Button
            {...props}
            leftIcon={<IconUpload />}
            size="lg"
            color="cyan"
            disabled={isLoading}
          >
            Unggah Foto
          </Button>
        )}
      </FileButton>
      <Button
        hidden={!photo}
        color="red"
        onClick={clearPhoto}
        size="lg"
        leftIcon={<IconTrash />}
        disabled={isLoading}
      >
        Hapus
      </Button>
    </Group>
  );
};

export default UploadContainer;
