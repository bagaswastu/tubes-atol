import {
  Button,
  Card,
  Center,
  Container,
  Image,
  Stack,
  Text
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { NavigationProgress, setNavigationProgress } from '@mantine/nprogress';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IconLockOpen } from 'tabler-icons';
import HeaderContainer from '../../components/HeaderContainer';
import { getSnap } from '../../lib/redis';

const SnapDetail = ({ error, image, caption, countdown: c }: any) => {
  const [countdown, setCountdown] = useState(c);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    if (!isOpen) return;
    setNavigationProgress((countdown / c) * 100);
    if (countdown < 1) {
      showNotification({
        title: 'Gambar ditutup',
        message: 'Gambar ditutup karena waktu habis',
        color: 'cyan',
      });
      router.push('/');
    }
  }, [countdown, router, c, isOpen]);

  function openImage() {
    fetch(`/api/delete-snap?id=${router.query.id}`, {
      method: 'DELETE',
    }).then((res) => {
      if (res.ok) {
        setIsOpen(true);
      } else {
        alert('Terjadi kesalahan');
      }
    });
  }

  if (error) {
    return <Center>{error}</Center>;
  }

  if (!isOpen) {
    return (
      <Container size="xs">
        <Stack my={40} spacing="lg">
          <HeaderContainer withSlogan={false} />
          <Button
            size="lg"
            color="cyan"
            leftIcon={<IconLockOpen />}
            onClick={openImage}
          >
            Buka gambar
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <>
      <NavigationProgress />
      <Container size="xs">
        <Stack my={40}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Stack>
              <Image
                src={image}
                alt="asd"
                height={400}
                fit="contain"
                onContextMenu={() => false}
                sx={{ pointerEvents: 'none' }}
              />
              {caption !== '' && (
                <Text
                  size="lg"
                  sx={{ cursor: 'default', wordWrap: 'break-word' }}
                  weight={400}
                  align="center"
                >
                  {caption}
                </Text>
              )}
            </Stack>
          </Card>
          <Text color="gray" sx={{ cursor: 'default' }} align="center">
            Gambar akan ditutup dalam {countdown} detik
          </Text>
        </Stack>
      </Container>
    </>
  );
};

export default SnapDetail;

export async function getServerSideProps(context: NextPageContext) {
  const id = context.query.id as string;

  try {
    const snap = await getSnap(id.toUpperCase());

    if (snap.countdown === null) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        image: snap.image,
        caption: snap.caption,
        countdown: snap.countdown,
      },
    };
  } catch (err: any) {
    return {
      props: {
        error: err.toString(),
      },
    };
  }
}
