import { Button, Collapse, Stack, Image, Loader, Group } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { Dispatch, SetStateAction, useState } from 'react';
import { IconDownload, IconLink, IconQrcode } from 'tabler-icons';

type Props = {
  url: string;
  setUrl: Dispatch<SetStateAction<string | null>>;
};

const ExtraUrlContainer = ({ url, setUrl }: Props) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isLoadingQrCode, setIsLoadingQrCode] = useState<boolean>(false);
  const [isLoadingShortener, setIsLoadingShortener] = useState<boolean>(false);

  function generateQrCode() {
    setIsLoadingQrCode(true);

    fetch(
      `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${url}&color=1098ad`,
      {
        method: 'GET',
      }
    )
      .then((res) => res.blob())
      .then((file) => {
        const url = URL.createObjectURL(file);
        setQrCodeUrl(url);
      })
      .finally(() => {
        setIsLoadingQrCode(false);
      });
  }

  function saveQrCode() {
    if (qrCodeUrl === null) return;
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'qr-code.png';
    link.click();
  }

  function generateShortUrl() {
    setIsLoadingShortener(true);

    fetch(
      `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${process.env.NEXT_PUBLIC_SHORTENER_API_KEY}`,
      {
        method: 'POST',
        body: JSON.stringify({
          dynamicLinkInfo: {
            domainUriPrefix: process.env.NEXT_PUBLIC_SHORTENER_DOMAIN,
            link: url,
          },
          suffix: {
            option: 'SHORT',
          },
        }),
      }
    )
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error('Failed to generate short url');
        }
      })
      .then((body) => {
        setUrl(body.shortLink);
        showNotification({
          title: 'Berhasil membuat short link',
          message: 'Silahkan salin kembali URL',
        });
      })
      .catch((_) => {
        showNotification({
          message: 'Terjadi kesalahan saat membuat short url',
          color: 'red'
        });
      })
      .finally(() => {
        setIsLoadingShortener(false);
      });
  }

  return (
    <Stack>
      <Group grow>
        {!qrCodeUrl ? (
          <Button
            color="dark"
            leftIcon={<IconQrcode />}
            onClick={generateQrCode}
            loading={isLoadingQrCode}
            disabled={qrCodeUrl !== null}
          >
            Buat QR
          </Button>
        ) : (
          <Button
            leftIcon={<IconDownload />}
            onClick={saveQrCode}
            color="green"
          >
            Simpan QR
          </Button>
        )}
        <Button
          color="blue"
          leftIcon={<IconLink />}
          onClick={generateShortUrl}
          loading={isLoadingShortener}
        >
          URL Singkat
        </Button>
      </Group>
      <Collapse in={qrCodeUrl !== null}>
        {qrCodeUrl && (
          <Image
            height={200}
            src={qrCodeUrl}
            alt="qr code"
            fit="contain"
            withPlaceholder
            placeholder={<Loader />}
          />
        )}
      </Collapse>
    </Stack>
  );
};

export default ExtraUrlContainer;
