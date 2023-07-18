import {Box, Center, Stack, StackProps} from '@chakra-ui/react'

export const Main = (props: StackProps) => (
  <Stack
    spacing="1.5rem"
    width="100%"
    height="100%"
    maxWidth="48rem"
    p="1rem"
    overflowX="hidden"
    flexDir={'column-reverse'}
    {...props}
  />
)
