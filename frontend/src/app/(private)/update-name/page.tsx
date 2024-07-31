import UserNameForm from '@/components/create-profile/user-name-form';
import PageSubtitle from '@/components/parts/page-subtitle';
import PageTitle from '@/components/parts/page-title';
import SkipLink from '@/components/parts/skip-link';
import { PRIVATE_ROUTES } from '@/constants';

export default function UserNamePage() {
  return (
    <div className="space-y-10">
      <div>
        <PageTitle text={'Tell us your name!'} />
        <PageSubtitle text={'You can skip this and add these details later if you like.'} />
      </div>

      <SkipLink href={PRIVATE_ROUTES.DASHBOARD} skipLinkText="Skip this and go to Dashboard" />

      <UserNameForm />
    </div>
  );
}
