import { useEffect, useState } from "react";
import { Button, Form, Navbar, Nav, Container, Modal } from "react-bootstrap";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import contractAbi from "./abi/stable.json";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [minimumEth, setMinimumEth] = useState();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState();
  const [account, setAccount] = useState();
  const [contractBalance, setContractBalance] = useState();
  const [totalSupply, setTotalSupply] = useState();
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");

  const connectWallet = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      setProvider(new ethers.BrowserProvider(provider));
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } else {
      console.log("Please install MetaMask!");
      setErrorMessage("Please install MetaMask!");
      setShowError(true);
    }
  };

  // Replace with your contract's ABI and address
  const contractAddress = "0x06A39Fec245B7391CBAD466c835Ac81503f8E1BA";
  const getBalance = async () => {
    if (!provider) return;
    const balance = await provider.getBalance(contractAddress);
    setContractBalance(ethers.formatEther(balance));
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);
    const _totalSupply = await contract.totalSupply();
    setTotalSupply(ethers.formatEther(_totalSupply));
    const minimumETH = await contract.minimumEth();
    setMinimumEth(ethers.formatEther(minimumETH));
  };

  useEffect(() => {
    if (!provider) return;
    getBalance();
    const interval = setInterval(() => {
      getBalance();
    }, 1500);
    return () => {
      clearInterval(interval); // Clear interval on component unmount
    };
  }, [provider]);

  const handleClick1 = async (eth) => {
    try {
      // Handle button 1 click
      if (!provider) return;
      setIsLoading(true);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );
      const depositETH = await contract.depositETH({
        value: ethers.parseEther(eth),
      });
      const processDeposite = await depositETH.wait();
      console.log(processDeposite);
      await getBalance();
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
      setShowError(true);
      console.error(error);
    }
  };

  const handleClick2 = async (eth) => {
    try {
      if (!provider) return;
      // Handle button 2 click
      setIsLoading(true);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );
      const nUSD = String(ethers.parseEther(eth));
      const checkAllowance = ethers.parseEther(
        (await contract.allowance(contractAddress, account)).toString()
      );
      if (checkAllowance < eth) {
        const getApprovel = await contract.approve(contractAddress, nUSD);
        const porcessApproval = await getApprovel.wait();
        console.log(await porcessApproval.hash);
      }
      const withdrawETH = await contract.redeem(String(nUSD));
      const processRedeem = await withdrawETH.wait();
      console.log(processRedeem.hash);
      await getBalance();
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
      setShowError(true);
      console.error(error);
    }
  };

  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#">MyApp</Navbar.Brand>
          <Nav className="me-auto">
            <Button variant="outline-success" onClick={connectWallet}>
              {account ? `Connected: ${account}` : "Connect Wallet"}
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <Container>
        <h1>Network: Sepolia</h1>
        <h3>Contract Balance: {contractBalance || "Loading..."}</h3>
        <h3>Total Supply: {totalSupply || "Loading..."}</h3>
        <h3>Minimum ETH: {minimumEth || "Loading..."}</h3>
        <Form>
          <Form.Group controlId="formBasicInput1">
            <Form.Label>Input field 1</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter input field 1"
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
            />
            <Button
              variant="primary"
              onClick={() => handleClick1(input1)}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Deposit ETH"}
            </Button>
          </Form.Group>
          <Form.Group controlId="formBasicInput2">
            <Form.Label>Input field 2</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter input field 2"
              value={input2}
              onChange={(e) => setInput2(e.target.value)}
            />
            <Button
              variant="secondary"
              onClick={() => handleClick2(input2)}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Redeem ETH"}
            </Button>
          </Form.Group>
        </Form>
      </Container>

      <Modal show={showError} onHide={() => setShowError(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowError(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
