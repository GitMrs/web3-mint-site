import { useState } from "react";
import { ethers, BigNumber } from "ethers";
import roboPunksNFT from "./RoboPunlsNFT.json";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
const roboPunksNFTAddress = "0xB2AC06872Cec326e89fEc5c80ACda2601e75d72f";

const MainMint = ({ accounts, setAccounts }) => {
  const [mintAmount, setMintAmount] = useState(1);
  const isConected = Boolean(accounts[0]);

  async function handleMint() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        roboPunksNFTAddress,
        roboPunksNFT.abi,
        signer
      );
      console.log(contract);
      try {
        const response = await contract.mint(BigNumber.from(mintAmount), {
          value: ethers.utils.parseEther((0.02 * mintAmount).toString()),
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
  }
  const handleDecrement = () => {
    if (mintAmount <= 1) return;
    setMintAmount(mintAmount - 1);
  };
  const handleIncreament = () => {
    if (mintAmount >= 3) return;
    setMintAmount(mintAmount + 1);
  };
  return (
    <Flex justify="center" align="center" height="100vh" paddingBottom="150px">
      <Box width="520px">
        <div>
          <Text fontSize="48px" textShadow="0 5px #000">
            {" "}
            RoboPunks{" "}
          </Text>
          <Text
            fontSize="30px"
            letterSpacing="-5.5%"
            fontFamily="VT323"
            textShadow="0 2px 2px #000"
          >
            It's 2078. Can thr RoboPunks NFT save humans from destructive
            rampant NFT speculation? Mint Robopunks to find out.{" "}
          </Text>
          {isConected ? (
            <div>
              <Flex align="center" justify="center">
                <Button
                  backgroundColor="#d6517d"
                  borderRadius="5px"
                  boxShadow="0px 2px 2px 1px #0f0f0f"
                  color="white"
                  cursor="pointer"
                  fontFamily="inherit"
                  padding="15px"
                  marginTop="0 10px"
                  onClick={handleDecrement}
                >
                  -
                </Button>
                <Input
                  readOnly
                  fontFamily="inherit"
                  width="100px"
                  height="40px"
                  textAlign="center"
                  paddingLeft="19px"
                  marginTop="10px"
                  type="number"
                  value={mintAmount}
                />
                <Button
                  backgroundColor="#d6517d"
                  borderRadius="5px"
                  boxShadow="0px 2px 2px 1px #0f0f0f"
                  color="white"
                  cursor="pointer"
                  fontFamily="inherit"
                  padding="15px"
                  marginTop="0 10px"
                  onClick={handleIncreament}
                >
                  +
                </Button>
              </Flex>
              <Button
                backgroundColor="#d6517d"
                borderRadius="5px"
                boxShadow="0px 2px 2px 1px #0f0f0f"
                color="white"
                cursor="pointer"
                fontFamily="inherit"
                padding="15px"
                marginTop="15px"
                onClick={handleMint}
              >
                MINT NOW
              </Button>
            </div>
          ) : (
            <Text
              marginTop="70px"
              fontSize="30px"
              letterSpacing="-5.5%`"
              fontFamily="VT323"
              textShadow="0 3px #000"
              color="#d6517d"
            >
              {" "}
              You must be connected to Mint.{" "}
            </Text>
          )}
        </div>
      </Box>
    </Flex>
  );
};
export default MainMint;
