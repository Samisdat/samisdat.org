import { styled } from "@linaria/react";
import { FC, HTMLAttributes } from "react";

import {MDXRemote, MDXRemoteSerializeResult} from 'next-mdx-remote'
import {Typo} from "@/components/Typo";

const MarkdownStyling = styled.div`
  width: min(100% - 2rem, 1024px);
  margin-inline: auto;
`;


const components = {
    p: (props) => <Typo variant="p" {...props} />,
    em: (props) => <Typo variant="em" {...props} />,
    strong: (props) => <Typo variant="strong" {...props} />,

}

interface MarkdownProps extends HTMLAttributes<HTMLDivElement>{
    serializedSource: MDXRemoteSerializeResult;
}

export const Markdown: FC<MarkdownProps> = ({ serializedSource }) => {

    return (
        <MarkdownStyling>
            <MDXRemote {...serializedSource} components={components}/>
        </MarkdownStyling>
    )
};
