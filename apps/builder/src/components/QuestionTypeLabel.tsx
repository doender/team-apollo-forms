import { Badge } from '@chakra-ui/react';
import * as React from 'react';
import { FC } from 'react';
import { FaAt, FaExpand, FaFont, FaHeart, FaListUl, FaParagraph, FaPlus, FaSortNumericDown } from 'react-icons/fa';
import { BlockType, QuestionType } from '../types';

const getColorAndIcon = (type?: QuestionType | BlockType): { color: string; icon: React.ReactNode } => {
    const size = 16;
    switch (type) {
        case QuestionType.EMAIL:
            return { color: 'orange', icon: <FaAt size={size} /> };
        case QuestionType.LONG_TEXT:
            return { color: 'cyan', icon: <FaParagraph size={size} /> };
        case QuestionType.MULTIPLE_CHOICE:
            return { color: 'purple', icon: <FaListUl size={size} /> };
        case QuestionType.NUMBER:
            return { color: 'green', icon: <FaSortNumericDown size={size} /> };
        case QuestionType.OPINION_SCALE:
            return { color: 'pink', icon: <FaHeart size={size} /> };
        case QuestionType.SHORT_TEXT:
            return { color: 'blue', icon: <FaFont size={size} /> };
        case BlockType.PLACEHOLDER:
            return { color: 'gray', icon: <FaExpand size={size} /> };
        default:
            return { color: 'blue', icon: <FaPlus size={size} /> };
    }
};

export const QuestionTypeLabel: FC<{ type?: QuestionType | BlockType }> = ({ type, ...props }) => {
    const { color, icon } = getColorAndIcon(type);
    return (
        <Badge variant="subtle" colorScheme={color} size="md" p={2} {...props}>
            {icon}
        </Badge>
    );
};
