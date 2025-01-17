import React, { useState } from "react";
import {
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	VStack,
	useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/chatProvider";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [show, setShow] = useState(false);
	//its a notification box at bottom
	const toast = useToast();
	const [loading, setLoading] = useState(false);
	const { setUser } = ChatState();
	const navigate = useNavigate();
	const submitHandler = async () => {
		setLoading(true);
		if (!email || !password) {
			toast({
				title: "Please fill all fields",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
		}

		try {
			const config = {
				headers: {
					"Content-type": "application/json",
				},
			};
			const { data } = await axios.post(
				"/api/user/login",
				{ email, password },
				config
			);
			//to make sure chatprovider has the user value when it gets set
			setUser(data);
			toast({
				title: "Login Successful",
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			localStorage.setItem("userInfo", JSON.stringify(data));
			setLoading(false);
			//push to the chats page
			navigate("/chats");
		} catch (error) {
			setLoading(false);
			toast({
				title: "Error Occured",
				description: error.response.data.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
		}
	};
	return (
		<>
			<VStack spacing="5px">
				<FormControl id="email" isRequired>
					<FormLabel>Email </FormLabel>
					<Input
						placeholder="Enter Your Email address"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</FormControl>
				<FormControl id="password" isRequired>
					<FormLabel>Password </FormLabel>
					<InputGroup>
						<Input
							type={show ? "text" : "password"}
							placeholder="Enter Your Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<InputRightElement width="4.5em">
							<Button h="1.75em" size="sm" onClick={() => setShow(!show)}>
								{show ? "Hide" : "Show"}
							</Button>
						</InputRightElement>
					</InputGroup>
				</FormControl>
				<Button
					colorScheme="blue"
					width="100%"
					color="white"
					onClick={submitHandler}
					isLoading={loading}
				>
					Log in
				</Button>
				<Button
					colorScheme="red"
					width="100%"
					color="white"
					onClick={() => {
						setEmail("guest@gmail.com");
						setPassword("guest12345");
					}}
					isLoading={loading}
				>
					Use Guest Credentials
				</Button>
			</VStack>
		</>
	);
};

export default Login;
