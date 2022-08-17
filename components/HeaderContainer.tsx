import { ActionIcon, Group, Stack, Text, Title } from '@mantine/core';
import { useRouter } from 'next/router';
import { IconSend } from 'tabler-icons';

type Props = {
  withSlogan: boolean;
};

const HeaderContainer = (props: Props) => {
  const router = useRouter();
  return (
    <Stack align="center">
      <Group
        align="center"
        onClick={() => router.push('/')}
        sx={{ cursor: 'pointer' }}
      >
        <ActionIcon variant="filled" color="cyan" size="lg">
          <IconSend />
        </ActionIcon>
        <Title>
          Snap
          <Text color="cyan" component="span">
            Send
          </Text>
        </Title>
      </Group>
      {props.withSlogan && (
        <Text color="grey">Kirim foto kini tak perlu khawatir 😉</Text>
      )}
    </Stack>
  );
};

export default HeaderContainer;
