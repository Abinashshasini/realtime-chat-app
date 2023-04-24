import Button from '@/components/ui/Button';
import { db } from '@/lib/dB';

export default async function Home() {
  await db.set('hello', 'hello');
  return <Button variant="ghost">Hello</Button>;
}
