import React from "react";
import { Box, Button, Flex, Image, Link, Spacer } from "@chakra-ui/react";

import Facebook from "./assets/social-media-icons/facebook_32x32.png";
import Email from "./assets/social-media-icons/email_32x32.png";
import Twitter from "./assets/social-media-icons/twitter_32x32.png";

const NavBar = ({ accounts, setAccounts }) => {
  const isConected = Boolean(accounts[0]);
  async function connectAccount() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccounts(accounts);
    }
  }
  return (
    <Flex justify="space-between" align="center" padding="30px">
      {/* left Side  */}

      <Flex justify="space-around" width="40%" padding="0 75px">
        <Link href="https://www.facebook.com">
          <Image src={Facebook} margin="0 15px" boxSize="42px" />
        </Link>
        <Link href="https://www.twitter.com">
          <Image src={Twitter} margin="0 15px" boxSize="42px" />
        </Link>
        <Link href="https://www.gmail.com">
          <Image src={Email} margin="0 15px" boxSize="42px" />
        </Link>
      </Flex>

      {/* right side */}
      <Flex justify="space-between" align="center" padding="30px" width="40%">
        <Box>About</Box>
        <Spacer />
        <Box>Mint</Box>
        <Spacer />
        <Box>Team</Box>
        <Spacer />
        {isConected ? (
          <Box margin="0 15px">Connected</Box>
        ) : (
          <Button
            backgroundColor="#d6517d"
            borderRadius="5px"
            boxShadow="0px 2px 2px 1px #0f0f0f"
            color="white"
            cursor="pointer"
            fontFamily="inherit"
            padding="15px"
            margin="0 15px"
            onClick={connectAccount}
          >
            {" "}
            Connect{" "}
          </Button>
        )}
      </Flex>
      {/* Connect */}
    </Flex>
  );
};
export default NavBar;
