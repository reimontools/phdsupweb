import ReactDOM from "react-dom";
import { Container, Title, Button } from "../../component";

const Dialog = {
    Action: ({ options, close  }) => {
        const execAction = action => {
            action();
            close()
        };
        if (options?.title) {
            return ReactDOM.createPortal(
                <Container.Overlay>
                    <Container.Dialog>
                        <Container.Basic>
                            <Title.Basic flexJustifyContent="flex-start">{options.title}</Title.Basic>
                            <Container.Flex flexJustifyContent="flex-start" margin="5px 0 15px 0">{options.text}</Container.Flex>
                            {options.family === "delete" 
                            ?   <Container.Flex flexJustifyContent="space-around">
                                    <Button.Basic onClick={() => close()} family="close" height="auto" fit>Cancel</Button.Basic>
                                    <Button.Basic onClick={() => execAction(options.action)} family="delete" height="auto" fit>Yes, delete it</Button.Basic>
                                </Container.Flex> 
                            :   <Container.Flex flexJustifyContent="flex-end">
                                    <Button.Basic onClick={() => close()} family="ok" height="auto" >Ok</Button.Basic>
                                </Container.Flex> 
                            }
                        </Container.Basic>
                    </Container.Dialog>
                </Container.Overlay>, document.getElementById("root-modal")
            );
        };
        return null;
    }
};

export default Dialog;