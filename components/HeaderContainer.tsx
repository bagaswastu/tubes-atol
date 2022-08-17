import { ActionIcon, Group, Stack, Text, Title } from '@mantine/core';
import { IconSend } from 'tabler-icons';

const HeaderContainer = () => {
  return (
    <Stack align="center" sx={{cursor: 'default'}}>
      <Group align="center">
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
      <Text color="grey">Kirim foto kini tak perlu khawatir 😉</Text>
    </Stack>
  );
};

export default HeaderContainer;
