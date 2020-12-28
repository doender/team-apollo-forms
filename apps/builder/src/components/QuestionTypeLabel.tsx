import { Badge } from '@chakra-ui/react';
import * as React from 'react';
import { FC } from 'react';
import { FaAlignLeft, FaAt, FaExpand, FaHeart, FaListUl, FaPlus, FaRulerHorizontal, FaSortNumericDown } from 'react-icons/fa';
import { BlockType, QuestionType } from '../types';

const getColorAndIcon = (type?: QuestionType | BlockType): { color: string; icon: React.ReactNode } => {
    const size = 16;
    switch (type) {
        case QuestionType.EMAIL:
            return { color: 'orange', icon: <FaAt size={size} /> };
        case QuestionType.LONG_TEXT:
            return { color: 'cyan', icon: <FaAlignLeft size={size} /> };
        case QuestionType.MULTIPLE_CHOICE:
            return { color: 'purple', icon: <FaListUl size={size} /> };
        case QuestionType.NUMBER:
            return { color: 'green', icon: <FaSortNumericDown size={size} /> };
        case QuestionType.OPINION_SCALE:
            return { color: 'pink', icon: <FaHeart size={size} /> };
        case QuestionType.SHORT_TEXT:
            return { color: 'blue', icon: <FaRulerHorizontal size={size} /> };
        case BlockType.PLACEHOLDER:
            return { color: 'gray', icon: <FaExpand /> };
        default:
            return { color: 'blue', icon: <FaPlus /> };
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
