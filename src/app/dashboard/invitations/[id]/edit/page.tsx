import { notFound } from 'next/navigation';
  import { prisma } from '@/lib/prisma';
  import EditorShell from '@/components/editor/EditorShell';

  interface Props { params: { id: string } }

  export default async function EditInvitationPage({ params }: Props) {
    const inv = await prisma.invitation.findUnique({ where: { id: params.id } });
    if (!inv) notFound();
    return <EditorShell invitationId={params.id} />;
  }
  