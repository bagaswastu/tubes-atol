import { Button, Collapse, Stack, Image, Loader } from '@mantine/core';
import { useState } from 'react';
import { IconDownload, IconQrcode } from 'tabler-icons';

type Props = {
  url: string;
};

const QrCodeContainer = ({ url }: Props) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function generateQrCode() {
    setIsLoading(true);

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
        setIsLoading(false);
      });
  }

  function saveQrCode() {
    if (qrCodeUrl === null) return;
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'qr-code.png';
    link.click();
  }

  return (
    <Stack>
      {!qrCodeUrl ? (
        <Button
          color="cyan"
          leftIcon={<IconQrcode />}
          onClick={generateQrCode}
          loading={isLoading}
          disabled={qrCodeUrl !== null}
        >
          Buat QR Code
        </Button>
      ) : (
        <Button leftIcon={<IconDownload />} onClick={saveQrCode} color="green">
          Simpan QR Code
        </Button>
      )}
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

export default QrCodeContainer;
