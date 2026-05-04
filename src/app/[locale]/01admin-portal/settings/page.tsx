import { getSettings } from '@/app/actions/settings';
import SettingsForm from './SettingsForm';

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-heading text-primary-anthracite uppercase tracking-[0.2em]">Instellingen</h1>
          <p className="text-primary-anthracite/40 font-serif italic mt-2">Beheer je winkelconfiguratie en bedrijfsgegevens.</p>
        </div>
      </div>

      <SettingsForm initialSettings={JSON.parse(JSON.stringify(settings))} />
    </div>
  );
}
