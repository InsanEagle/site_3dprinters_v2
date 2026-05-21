import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionTitle } from "@/components/shared/section-title";

export const metadata: Metadata = {
  title: "Политика обработки персональных данных | Изготовление деталей",
  description: "Как сайт обрабатывает данные из заявок на изготовление деталей, 3D-печать и 3D-сканирование."
};

const dataItems = [
  "имя или обращение, которое вы указываете в форме;",
  "контакт для связи: телефон, email, мессенджер или другой удобный способ;",
  "марка и модель автомобиля, если вы их указали;",
  "описание задачи, детали, изделия или вопроса;",
  "файлы и фотографии, которые вы прикрепляете к заявке."
];

const usageItems = [
  "чтобы понять задачу и связаться с вами по заявке;",
  "чтобы оценить возможность изготовления, 3D-печати, 3D-сканирования или подбора детали;",
  "чтобы уточнить материалы, сроки, стоимость и способ передачи готового изделия;",
  "чтобы вести внутренний список заявок и не потерять переписку по обращению."
];

export default function PolicyPage() {
  return (
    <div className="py-16 sm:py-20">
      <Container>
        <SectionTitle
          eyebrow="Персональные данные"
          title="Политика обработки персональных данных"
          description="Этот текст описывает базовые правила обработки данных для MVP сайта. Он написан простым языком и не подменяет индивидуальные юридические документы владельца бизнеса."
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <section className="rounded-[32px] border border-line bg-white p-8">
            <h2 className="text-2xl font-semibold text-ink">Какие данные собираются</h2>
            <ul className="mt-5 grid gap-3 text-base leading-7 text-body">
              {dataItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-[32px] border border-line bg-surface p-8">
            <h2 className="text-2xl font-semibold text-ink">Зачем они нужны</h2>
            <ul className="mt-5 grid gap-3 text-base leading-7 text-body">
              {usageItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-8 grid gap-6">
          <section className="rounded-[32px] border border-line bg-white p-8">
            <h2 className="text-2xl font-semibold text-ink">Файлы и фотографии</h2>
            <p className="mt-4 text-base leading-7 text-body">
              Прикрепленные файлы и фотографии используются только для оценки и обработки вашей заявки: понять форму детали,
              состояние образца, особенности крепления, размеры или другие технические детали. Файлы не предназначены для
              публичной публикации на сайте.
            </p>
          </section>

          <section className="rounded-[32px] border border-line bg-white p-8">
            <h2 className="text-2xl font-semibold text-ink">Кому передаются данные</h2>
            <p className="mt-4 text-base leading-7 text-body">
              Данные из заявки могут попадать во внутреннюю панель сайта и в рабочие каналы обработки заявок: webhook-приемник,
              таблицу, почту или мессенджер, если они настроены владельцем сайта. Эти каналы нужны только для обработки обращения
              и связи с вами.
            </p>
            <p className="mt-4 text-base leading-7 text-body">
              Если на сайте включена аналитика посещений, она используется для понимания работы страниц и улучшения сайта.
            </p>
          </section>

          <section className="rounded-[32px] border border-line bg-surface p-8">
            <h2 className="text-2xl font-semibold text-ink">Как запросить удаление</h2>
            <p className="mt-4 text-base leading-7 text-body">
              Если вы хотите уточнить, изменить или удалить данные из отправленной заявки, напишите через форму на странице{" "}
              <Link href="/contacts" className="font-medium text-accent transition hover:text-accent-hover">
                контактов
              </Link>
              . В сообщении укажите, какие данные или какую заявку нужно удалить. После проверки обращения данные будут удалены
              из рабочих хранилищ, если их не требуется сохранять по законным основаниям.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
