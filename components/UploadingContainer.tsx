import {
  Button,
  Center,
  Image,
  Input,
  Loader,
  LoadingOverlay,
  Radio,
  Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { compressAccurately } from 'image-conversion';
import { compress } from 'jpegasus';
import React, { useEffect, useState } from 'react';
import { IconSend } from 'tabler-icons';

type Props = {
  photo: File | null;
  onUpload: (photo: File, duration: string, caption: string) => Promise<void>;
  isLoading: boolean;
};

const MemoizedImage = React.memo(function MemoizedImage({
  photo,
}: {
  photo: File;
}) {
  return (
    <Image
      src={window.URL.createObjectURL(photo)}
      alt="asd"
      height={400}
      fit="contain"
      withPlaceholder
      placeholder={<Loader />}
    />
  );
});

const UploadingContainer = ({ photo, onUpload, isLoading }: Props) => {
  const [compressedPhoto, setCompreseedImage] = useState<File | null>(null);

  useEffect(() => {
    if (photo) {
      // convert
      compressAccurately(photo, 200).then((f) => {
        compress(f as File, {
          quality: 0.8,
        }).then((fCompressed) => {
          setCompreseedImage(fCompressed as File);
        });
      });
    }
  }, [photo]);

  const form = useForm({
    initialValues: {
      duration: '3',
      caption: '',
    },
  });

  function onSubmit(values: any) {
    if (!compressedPhoto) return;
    onUpload(compressedPhoto, values.duration, values.caption);
  }

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <Stack>
        {compressedPhoto ? (
          <MemoizedImage photo={compressedPhoto} />
        ) : (
          <Center
            sx={{
              height: 400,
            }}
          >
            <Loader />
          </Center>
        )}
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack spacing="md">
            <Radio.Group
              required
              label="Pilih durasi"
              description="Durasi kadaluarsa foto"
              error="Durasi harus diisi"
              {...form.getInputProps('duration')}
            >
              <Radio value="3" label="3 detik" defaultChecked />
              <Radio value="5" label="5 detik" />
              <Radio value="10" label="10 detik" />
            </Radio.Group>
            <Input.Wrapper
              label="Caption"
              description="Tulis keterangan untuk fotomu (opsional)"
            >
              <Input
                placeholder="Tambah caption"
                size="md"
                sx={{ flex: 1 }}
                {...form.getInputProps('caption')}
              />
            </Input.Wrapper>

            <Button
              color="cyan"
              type="submit"
              size="md"
              disabled={!compressedPhoto}
              leftIcon={<IconSend />}
            >
              Bagikan
            </Button>
          </Stack>
        </form>
      </Stack>
    </>
  );
};

export default UploadingContainer;
