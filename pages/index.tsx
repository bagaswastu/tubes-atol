import {
  Button,
  Card,
  Collapse,
  Container,
  CopyButton,
  Group,
  Input,
  LoadingOverlay,
  Modal,
  Stack,
} from '@mantine/core';
import { compressAccurately } from 'image-conversion';
import { compress as jpegasusCompress } from 'jpegasus';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { IconCheck, IconLink, IconQrcode } from 'tabler-icons';
import HeaderContainer from '../components/HeaderContainer';
import QrCodeContainer from '../components/QrCodeContainer';
import UploadContainer from '../components/UploadContainer';
import UploadingContainer from '../components/UploadingContainer';

type State = 'intiial' | 'uploading' | 'loading' | 'uploaded';

const Home: NextPage = () => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [state, setState] = useState<State>('intiial');

  useEffect(() => {
    if (photoUrl) {
      setState('uploaded');
    } else if (photo) {
      setState('uploading');
    } else {
      setState('intiial');
    }
  }, [photo, photoUrl]);

  useEffect(() => {
    if (state === 'intiial') {
      setPhoto(null);
      setPhotoUrl(null);
    }else if(state === 'uploaded'){
      setPhoto(null);
    }
  }, [state]);

  async function onUpload(photo: File, duration: string, caption: string) {
    if (photo === null) return;
    setState('loading');

    // convert

    const reader = new FileReader();
    reader.onload = (e) => {
      let imgBase64 = e.target?.result as string;

      const payload = JSON.stringify({
        image: imgBase64,
        caption,
        countdown: parseInt(duration),
      });
      
      fetch('/api/upload-snap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            throw Error('Terjadi galat pada saat upload foto');
          }
        })
        .then((body) => {
          body.id &&
            setPhotoUrl(
              window.location.hostname + '/snap/' + body.id.toLowerCase()
            );
          setState('uploaded');
        })
        .catch((err) => {
          alert(err);
          setState('uploading');
        });
    };
    reader.readAsDataURL(photo);
  }

  return (
    <>
      <Container size="xs">
        <Stack my={40}>
          <HeaderContainer />
          <UploadContainer
            photo={photo}
            setPhoto={setPhoto}
            isLoading={state === 'loading'}
          />
          {(state === 'uploading' || state === 'loading') && (
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <UploadingContainer
                photo={photo}
                onUpload={onUpload}
                isLoading={state === 'loading'}
              />
            </Card>
          )}
        </Stack>
      </Container>
      <Modal
        opened={state === 'uploaded'}
        // opened={true}
        onClose={() => setState('intiial')}
        title="Berhasil diupload! 🎉"
        closeOnEscape={false}
        closeOnClickOutside={false}
        centered={true}
      >
        <Stack>
          <Group>
            <Input
              icon={<IconLink />}
              value={photoUrl ?? ''}
              sx={{ flex: 1 }}
              disabled
            />
            <CopyButton value={photoUrl ?? ''}>
              {({ copied, copy }) =>
                copied ? (
                  <Button leftIcon={<IconCheck />} color="green">
                    URL Disalin
                  </Button>
                ) : (
                  <Button leftIcon={<IconLink />} color="blue" onClick={copy}>
                    Salin URL
                  </Button>
                )
              }
            </CopyButton>
          </Group>
          {photoUrl && <QrCodeContainer url={photoUrl} />}
        </Stack>
      </Modal>
    </>
  );
};

export default Home;
