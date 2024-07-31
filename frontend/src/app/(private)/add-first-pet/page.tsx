
import FirstPetForm from '@/components/create-profile/first-pet-form';
import PageSubtitle from '@/components/parts/page-subtitle';
import PageTitle from '@/components/parts/page-title';
import SkipLink from '@/components/parts/skip-link';
import { PRIVATE_ROUTES } from '@/constants';

export default function UserNamePage() {
  return (
    <div className="space-y-10">
      <div>
        <PageTitle text={'Add your first wonderful animal!'} />
        <PageSubtitle text={'You can change details and more pets later.'} />
      </div>

      <SkipLink href={PRIVATE_ROUTES.DASHBOARD} skipLinkText="Skip this and go to Dashboard" />
      <SkipLink href={PRIVATE_ROUTES.UPDATE_NAME} skipLinkText="Skip this and update your name" />
      <FirstPetForm />
    </div>
  );
}
