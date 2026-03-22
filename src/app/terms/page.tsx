import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "ข้อกำหนดการใช้งาน - Raycast",
  description:
    "ข้อกำหนดและเงื่อนไขการใช้บริการ Raycast บริการ Canva Pro ราคาพิเศษ อ่านรายละเอียดเงื่อนไขการใช้งาน สิทธิ์ และข้อจำกัดความรับผิดชอบ",
});

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <header className="mb-12">
        <p className="text-violet-400 text-sm font-medium mb-2">
          ข้อตกลงและเงื่อนไข
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          ข้อกำหนดการใช้งาน
        </h1>
        <p className="text-gray-400 text-sm">
          ปรับปรุงล่าสุด: 22 มีนาคม 2569
        </p>
      </header>

      <div className="space-y-10 text-gray-300 text-[15px] leading-relaxed">

        {/* Section 1 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            1. การยอมรับข้อกำหนด
          </h2>
          <p className="mb-3">
            ยินดีต้อนรับสู่ Raycast
          </p>
          <p className="mb-3">
            การเข้าใช้งานและการใช้บริการของ Raycast (&ldquo;บริการของเรา&rdquo; หรือ &ldquo;เว็บไซต์นี้&rdquo;)
            ถือว่าคุณยอมรับและตกลงที่จะผูกพันตามข้อกำหนดการใช้งาน (&ldquo;ข้อตกลงนี้&rdquo;)
            หากคุณไม่เห็นด้วยกับข้อกำหนดใด ๆ โปรดหยุดใช้บริการของเราทันที
          </p>
          <p className="mb-3">
            เราขอสงวนสิทธิ์ในการแก้ไข เปลี่ยนแปลง หรืออัปเดตข้อตกลงนี้ได้ตลอดเวลา
            โดยจะแจ้งให้คุณทราบผ่านการประกาศบนหน้านี้
            การใช้บริการต่อไปภายหลังการเปลี่ยนแปลงถือว่าคุณยอมรับข้อตกลงที่แก้ไขแล้ว
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            2. คำอธิบายบริการ
          </h2>
          <p className="mb-3">
            Raycast เป็นแพลตฟอร์มที่ให้บริการเป็นตัวกลางในการสมัครและจัดการสมาชิก Canva Pro
            สำหรับผู้ใช้งานในประเทศไทย โดยมีรายละเอียดดังนี้:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              บริการสมัครแพลน Canva Pro ผ่านระบบของ Raycast ตามแพลนที่คุณเลือก
            </li>
            <li>
              บริการสนับสนุนลูกค้าและแจ้งสถานะบริการตลอด 24 ชั่วโมง 7 วัน
            </li>
            <li>
              บริการระบบแนะนำเพื่อน (Referral Program) สำหรับรับส่วนลดในการใช้บริการครั้งถัดไป
            </li>
            <li>
              บริการจัดการและต่ออายุสมาชิก Canva Pro ตามรอบบริการที่คุณสมัคร
            </li>
          </ul>
          <p className="mt-3">
            Raycast เป็นผู้ให้บริการตัวกลางที่ไม่ใช่ Canva หรือบริษัทในเครือ Canva
            สิทธิ์และเงื่อนไขของ Canva Pro ให้ผูกพันกับ Canva โดยตรง
            ตามที่ระบุในข้อ 6 ของข้อตกลงนี้
          </p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            3. บัญชีผู้ใช้
          </h2>
          <p className="mb-3">
            <strong className="text-white">3.1 การลงทะเบียน:</strong> คุณต้องลงทะเบียนบัญชีกับ Raycast
            โดยให้ข้อมูลที่ถูกต้อง ครบถ้วน และเป็นปัจจุบัน
            คุณมีหน้าที่รักษาความลับของรหัสผ่านและบัญชีของคุณ
            และรับผิดชอบต่อกิจกรรมทั้งหมดที่เกิดขึ้นภายใต้บัญชีของคุณ
          </p>
          <p className="mb-3">
            <strong className="text-white">3.2 ข้อกำหนดบัญชี:</strong> คุณต้องมีอายุไม่ต่ำกว่า 18 ปีบริบูรณ์
            ในการสมัครใช้บริการ หนึ่งบุคคลห้ามสมัครมากกว่าหนึ่งบัญชี
            และห้ามสมัครใช้บริการแทนผู้อื่นโดยไม่ได้รับอนุญาต
          </p>
          <p className="mb-3">
            <strong className="text-white">3.3 การระงับบัญชี:</strong> เราขอสงวนสิทธิ์ระงับหรือยกเลิกบัญชีของคุณ
            ได้ตลอดเวลาหากพบว่าคุณละเมิดข้อตกลงนี้ หรือมีเหตุอันควรเชื่อว่าบัญชีถูกใช้ในทางที่ผิดกฎหมาย
            โดยไม่จำเป็นต้องแจ้งให้ทราบล่วงหน้า
          </p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            4. แพลนและการชำระเงิน
          </h2>
          <p className="mb-3">
            <strong className="text-white">4.1 ราคาและค่าบริการ:</strong> ราคาของแต่ละแพลนปรากฏบนหน้าเว็บไซต์
            ณ วันที่คุณสมัคร ราคาที่แสดงเป็นราคาสุทธิรวมภาษีมูลค่าเพิ่ม (VAT) แล้ว
            เราขอสงวนสิทธิ์เปลี่ยนแปลงราคาได้ตลอดเวลา โดยจะแจ้งให้คุณทราบก่อนการต่ออายุครั้งถัดไป
          </p>
          <p className="mb-3">
            <strong className="text-white">4.2 วิธีการชำระเงิน:</strong> ปัจจุบันเรารองรับการชำระเงินผ่าน
            PromptPay / พร้อมเพย์ (QR Code) เท่านั้น การชำระเงินถือว่าเสร็จสิ้นเมื่อได้รับการยืนยัน
            จากระบบธนาคารหรือผู้ให้บริการชำระเงิน
          </p>
          <p className="mb-3">
            <strong className="text-white">4.3 การต่ออายุ (Auto-Renewal):</strong> การสมัครแพลนของคุณจะต่ออายุ
            โดยอัตโนมัติตามรอบบริการที่คุณเลือก (รายเดือน ราย 3 เดือน ราย 6 เดือน หรือรายปี)
            หากต้องการยกเลิกการต่ออายุอัตโนมัติ คุณต้องแจ้งความประสงค์ผ่านช่องทาง LINE ก่อนวันต่ออายุ
            อย่างน้อย 3 วันทำการ
          </p>
          <p className="mb-3">
            <strong className="text-white">4.4 การคืนเงิน:</strong> เนื่องจาก Canva Pro เป็นบริการดิจิทัล
            ที่เริ่มใช้งานได้ทันทีหลังสมัคร เราจึงไม่มีนโยบายคืนเงินสำหรับการใช้บริการที่เริ่มแล้ว
            หากมีปัญหาทางเทคนิคที่เราสามารถแก้ไขได้ เราจะดำเนินการแก้ไขให้โดยเร็วที่สุด
            กรณีพิเศษอื่น ๆ โปรดติดต่อมาที่ LINE:{" "}
            <a
              href="https://line.me/R/ti/p/@094tyojf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300"
            >
              @094tyojf
            </a>
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            5. ระบบแนะนำเพื่อน (Referral Program)
          </h2>
          <p className="mb-3">
            คุณสามารถเชิญเพื่อนใช้บริการ Raycast เพื่อรับส่วนลดสำหรับการใช้บริการครั้งถัดไป
            โดยมีเงื่อนไขดังนี้:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>คุณจะได้รับส่วนลดเมื่อเพื่อนที่คุณแนะนำสมัครแพลนและชำระเงินสำเร็จแล้วเท่านั้น</li>
            <li>จำนวนส่วนลดและเงื่อนไขเป็นไปตามที่ประกาศบนเว็บไซต์ ณ ขณะนั้น</li>
            <li>ส่วนลดไม่สามารถแลกเปลี่ยนเป็นเงินสดได้</li>
            <li>ห้ามใช้ช่องทางที่ผิดกฎหมายหรือสแปมในการแนะนำเพื่อน</li>
            <li>Raycast ขอสงวนสิทธิ์ในการยกเลิกสิทธิ์ส่วนลดหากพบการใช้งานที่ไม่เหมาะสม</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            6. บริการ Canva Pro
          </h2>
          <p className="mb-3">
            <strong className="text-white">6.1 สถานะของบริการ:</strong> Canva Pro เป็นบริการของ Canva Pty Ltd
            (&ldquo;Canva&rdquo;) Raycast เป็นเพียงตัวกลางในการช่วยเหลือคุณสมัครและจัดการบริการ Canva Pro
            เราไม่มีอำนาจควบคุมการเปลี่ยนแปลงคุณสมบัติ ราคา หรือนโยบายของ Canva
          </p>
          <p className="mb-3">
            <strong className="text-white">6.2 ข้อกำหนดของ Canva:</strong> การใช้บริการ Canva Pro ของคุณ
            อยู่ภายใต้ข้อกำหนดการใช้งาน (Terms of Use) และนโยบายความเป็นส่วนตัว (Privacy Policy)
            ของ Canva โปรดศึกษาและยอมรับข้อกำหนดเหล่านั้นด้วย
            ซึ่งสามารถดูได้ที่{" "}
            <a
              href="https://www.canva.com/policies/terms-of-service/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300"
            >
              canva.com/policies/terms-of-service
            </a>
          </p>
          <p className="mb-3">
            <strong className="text-white">6.3 ความพร้อมใช้งาน:</strong> เรามุ่งมั่นให้บริการแก่คุณ
            ตลอด 24 ชั่วโมง แต่ไม่สามารถรับประกันความพร้อมใช้งาน 100% ได้
            หาก Canva ประสบปัญหาหรือหยุดให้บริการ เราจะแจ้งให้คุณทราบโดยเร็วที่สุด
            และช่วยดำเนินการติดต่อ Canva เพื่อแก้ไขปัญหา
          </p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            7. พฤติกรรมที่ห้ามกระทำ
          </h2>
          <p className="mb-3">
            คุณตกลงที่จะไม่กระทำการใด ๆ ดังต่อไปนี้:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>ละเมิดกฎหมาย ข้อบังคับ หรือสิทธิ์ของบุคคลที่สามใด ๆ</li>
            <li>ใช้บริการเพื่อวัตถุประสงค์ที่ผิดกฎหมาย ฉ้อโกง หรือเพื่อหลีกเลี่ยงการชำระเงิน</li>
            <li>พยายามเข้าถึงบัญชีของผู้อื่นโดยไม่ได้รับอนุญาต</li>
            <li>แชร์บัญชี Canva Pro กับบุคคลอื่น (หนึ่งบัญชีต่อหนึ่งผู้ใช้)</li>
            <li>ใช้บอท สคริปต์อัตโนมัติ หรือซอฟต์แวร์ที่ไม่ได้รับอนุญาตเพื่อเข้าถึงบริการ</li>
            <li>สแปม กระจายมัลแวร์ หรือเนื้อหาที่เป็นอันตรายผ่านระบบของ Raycast</li>
            <li>โจมตีหรือทำให้ระบบของ Raycast หรือ Canva ล่มโดยเจตนา (DDoS / Intrusion)</li>
            <li>แอบอ้างเป็น Raycast หรือ Canva ในทางที่ผิด</li>
            <li>ใช้บริการของเราเพื่อสร้างบริการแข่งขันโดยตรงกับ Raycast</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            8. ทรัพย์สินทางปัญญา
          </h2>
          <p className="mb-3">
            <strong className="text-white">ของ Raycast:</strong> เว็บไซต์ ส่วนต่อประสาน (UI)
            โลโก้ ชื่อแบรนด์ &ldquo;Raycast&rdquo; กราฟิก ดีไซน์ และซอฟต์แวร์ทั้งหมดของ Raycast
            เป็นทรัพย์สินทางปัญญาของ Raycast และได้รับความคุ้มครองตามกฎหมาย
            ห้ามคัดลอก ดัดแปลง หรือเผยแพร่โดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร
          </p>
          <p className="mb-3">
            <strong className="text-white">ของ Canva:</strong> Canva, Canva Pro และเครื่องหมายการค้าที่เกี่ยวข้อง
            เป็นทรัพย์สินของ Canva Pty Ltd เราไม่มีส่วนเกี่ยวข้องกับ Canva และไม่ได้รับอนุญาตจาก Canva
            เว้นแต่ในฐานะตัวแทนจำหน่ายที่ได้รับอนุญาต
          </p>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            9. ข้อจำกัดความรับผิดชอบ
          </h2>
          <p className="mb-3">
            <strong className="text-white">9.1 บริการ &ldquo;ตามสภาพที่เป็น&rdquo;:</strong> บริการของ Raycast
            ให้ตามสภาพที่เป็น (&ldquo;as is&rdquo;) โดยไม่มีการรับประกันใด ๆ ไม่ว่าโดยชัดแจ้งหรือโดยปริยาย
            รวมถึงแต่ไม่จำกัดเพียงการรับประกันความสามารถในการใช้งาน ความเหมาะสมสำหรับวัตถุประสงค์เฉพาะ
            หรือการไม่ละเมิดสิทธิ์
          </p>
          <p className="mb-3">
            <strong className="text-white">9.2 ความเสียหาย:</strong> ในขอบเขตสูงสุดที่กฎหมายอนุญาต
            Raycast ไม่รับผิดต่อความเสียหายทางอ้อม ความเสียหายพิเศษ ความเสียหายต่อเนื่อง
            หรือความเสียหายเชิงลงโทษ รวมถึงการสูญเสียกำไร รายได้ ข้อมูล หรือโอกาสทางธุรกิจ
            ที่เกิดจากการใช้หรือการไม่สามารถใช้บริการ
          </p>
          <p className="mb-3">
            <strong className="text-white">9.3 ความรับผิดรวม:</strong> ความรับผิดรวมทั้งหมดของ Raycast
            ภายใต้ข้อตกลงนี้ จะไม่เกินจำนวนค่าบริการที่คุณชำระให้ Raycast ในช่วง 12 เดือนก่อนเกิดเหตุการณ์
            ที่เป็นสาเหตุของความเสียหายนั้น
          </p>
        </section>

        {/* Section 10 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            10. การระงับข้อพิพาทและกฎหมาย
          </h2>
          <p className="mb-3">
            <strong className="text-white">10.1 กฎหมายที่ใช้บังคับ:</strong> ข้อตกลงนี้อยู่ภายใต้
            กฎหมายแห่งราชอาณาจักรไทย คู่สัญญาทั้งสองฝ่ายตกลงว่าสถานที่ศาลที่มีเขตอำนาจ
            คือศาลที่ตั้งอยู่ในประเทศไทย
          </p>
          <p className="mb-3">
            <strong className="text-white">10.2 การระงับข้อพิพาท:</strong> หากมีข้อพิพาทเกิดขึ้น
            คุณตกลงจะติดต่อ Raycast ก่อนเพื่อพยายามระงับข้อพิพาทโดยทางไกล (Mediation)
            ภายใน 30 วันก่อนดำเนินการทางกฎหมายใด ๆ
          </p>
          <p className="mb-3">
            <strong className="text-white">10.3 การสละสิทธิ์คลาสแอ็กชัน:</strong> คุณตกลงที่จะไม่ฟ้องคดี
            ในฐานะสมาชิกคลาส (Class Action) หรือในฐานะผู้ร้องสอดแทน (Representative)
            ต่อ Raycast
          </p>
        </section>

        {/* Section 11 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            11. การยกเลิกบริการ
          </h2>
          <p className="mb-3">
            <strong className="text-white">11.1 ยกเลิกโดยคุณ:</strong> คุณสามารถยกเลิกบริการได้ตลอดเวลา
            โดยแจ้งผ่าน LINE:{" "}
            <a
              href="https://line.me/R/ti/p/@094tyojf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300"
            >
              @094tyojf
            </a>{" "}
            การยกเลิกจะมีผลเมื่อสิ้นสุดรอบบริการปัจจุบัน
            คุณจะยังสามารถใช้บริการ Canva Pro ได้จนถึงวันสิ้นสุดรอบที่ชำระเงินแล้ว
          </p>
          <p className="mb-3">
            <strong className="text-white">11.2 ยกเลิกโดย Raycast:</strong> เราขอสงวนสิทธิ์ยกเลิกบริการ
            หรือระงับบัญชีของคุณได้ทันทีหาก: คุณละเมิดข้อตกลงนี้ มีการชำระเงินไม่สำเร็จ
            หรือมีเหตุอันควรเชื่อว่าบัญชีถูกใช้ในทางที่ผิดกฎหมายหรือผิดนโยบาย
          </p>
        </section>

        {/* Section 12 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            12. การเชื่อมต่อกับบุคคลที่สาม
          </h2>
          <p className="mb-3">
            บริการของ Raycast อาจมีลิงก์ไปยังเว็บไซต์ บริการ หรือเนื้อหาของบุคคลที่สาม
            (&ldquo;เนื้อหาของบุคคลที่สาม&rdquo;) ซึ่งรวมถึง Canva, Vercel และผู้ให้บริการอื่น ๆ
            เราไม่ควบคุมและไม่รับผิดชอบต่อเนื้อหาหรือการปฏิบัติตามนโยบายความเป็นส่วนตัว
            ของบุคคลที่สาม คุณควรศึกษาและยอมรับข้อกำหนดของบุคคลที่สามก่อนใช้บริการของพวกเขา
          </p>
        </section>

        {/* Section 13 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            13. การเปลี่ยนแปลงบริการ
          </h2>
          <p className="mb-3">
            เราขอสงวนสิทธิ์ในการเปลี่ยนแปลง แก้ไข หรือยุติบริการ (หรือบางส่วนของบริการ)
            ของ Raycast ได้ตลอดเวลา โดยจะแจ้งให้คุณทราบล่วงหน้าผ่านอีเมลหรือประกาศบนเว็บไซต์
            หากการเปลี่ยนแปลงส่งผลกระทบอย่างมีนัยสำคัญต่อสิทธิ์ของคุณ เราจะให้เวลาคุณ 30 วัน
            ในการยกเลิกหากคุณไม่เห็นด้วย
          </p>
        </section>

        {/* Section 14 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            14. ข้อสรุป
          </h2>
          <p className="mb-3">
            หากข้อใดของข้อตกลงนี้ถูกวินิจฉัยว่าเป็นโมฆะหรือไม่สามารถบังคับใช้ได้
            ข้อตกลงส่วนที่เหลือจะยังคงมีผลบังคับใช้อย่างเต็มที่
            ความล้มเหลวของ Raycast ในการใช้สิทธิ์ใด ๆ ภายใต้ข้อตกลงนี้
            ไม่ถือว่าเป็นการสละสิทธิ์นั้น ๆ
          </p>
        </section>

        {/* Section 15 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            15. ติดต่อเรา
          </h2>
          <p className="mb-3">
            หากมีคำถามหรือข้อสงสัยเกี่ยวกับข้อตกลงนี้
            ติดต่อเราได้ที่:
          </p>
          <ul className="list-none space-y-2">
            <li>
              <strong className="text-white">LINE Official:</strong>{" "}
              <a
                href="https://line.me/R/ti/p/@094tyojf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300"
              >
                @094tyojf
              </a>
            </li>
            <li>
              <strong className="text-white">อีเมล:</strong>{" "}
              <a href="mailto:contact@raycast.app" className="text-violet-400 hover:text-violet-300">
                contact@raycast.app
              </a>
            </li>
          </ul>
          <p className="mt-4 text-gray-500 text-sm">
            เจ้าของบริการ: Raycast
            <br />
            ปรับปรุงล่าสุด: 22 มีนาคม 2569
          </p>
        </section>
      </div>
    </main>
  );
}
