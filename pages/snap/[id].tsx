import { Card, Center, Container, Image, Stack, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { NavigationProgress, setNavigationProgress } from '@mantine/nprogress';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { deleteSnap, getSnap } from '../../lib/redis';

const SnapDetail = ({ error, image, caption, countdown: c }: any) => {
  const [countdown, setCountdown] = useState(c);
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
    setNavigationProgress((countdown / c) * 100);
    if (countdown < 1) {
      showNotification({
        title: 'Gambar ditutup',
        message: 'Gambar ditutup karena waktu habis',
        color: 'cyan',
      });
      router.push('/');
    }
  }, [countdown, router, c]);

  if (error) {
    return <Center>{error}</Center>;
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

    await deleteSnap(id.toUpperCase());

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
