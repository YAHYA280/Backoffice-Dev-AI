import type { Theme } from '@mui/material/styles';
import type { IKanbanComment } from 'src/contexts/types/kanban';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { fToNow } from 'src/utils/format-time';

import { Image } from 'src/shared/components/image';
import { Lightbox, useLightBox } from 'src/shared/components/lightbox';

// ----------------------------------------------------------------------

type Props = {
  comments: IKanbanComment[];
};

export function KanbanDetailsCommentList({ comments }: Props) {
  const slides = comments
    .filter((comment) => comment.messageType === 'image')
    .map((slide) => ({ src: slide.message }));

  const lightbox = useLightBox(slides);

  return (
    <>
      <Stack component="ul" spacing={3}>
        {comments.map((comment) => (
          <Stack component="li" key={comment.id} direction="row" spacing={2}>
            <Avatar src={comment.avatarUrl} />

            <Stack spacing={comment.messageType === 'image' ? 1 : 0.5} flexGrow={1}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle2"> {comment.name}</Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  {fToNow(comment.createdAt)}
                </Typography>
              </Stack>

              {comment.messageType === 'image' ? (
                <Image
                  alt={comment.message}
                  src={comment.message}
                  onClick={() => lightbox.onOpen(comment.message)}
                  sx={{
                    borderRadius: 1.5,
                    cursor: 'pointer',
                    transition: (theme : Theme) => theme.transitions.create(['opacity']),
                    '&:hover': { opacity: 0.8 },
                  }}
                />
              ) : (
                <Typography variant="body2">{comment.message}</Typography>
              )}
            </Stack>
          </Stack>
        ))}
      </Stack>

      <Lightbox
        index={lightbox.selected}
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
      />
    </>
  );
}
