'use client';

interface InvoiceProps {
  order: any;
}

export default function OrderInvoice({ order }: InvoiceProps) {
  // Ürünlerin toplam brüt fiyatı
  const itemsGrossTotal = order.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
  
  // Kargo ücreti (Brüt)
  const shippingGrossTotal = order.totalAmount - itemsGrossTotal;
  
  // GENEL TOPLAM üzerinden KDV hesaplama (Hollanda standartı: Kargo da ürünle aynı KDV'ye tabidir)
  const grandTotal = order.totalAmount;
  const subtotalAll = Math.round((grandTotal / 1.21) * 100) / 100;
  const vatAmountAll = Math.round((grandTotal - subtotalAll) * 100) / 100;

  return (
    <div id={`invoice-${order.orderNumber}`} className="bg-white p-10 text-primary-anthracite font-sans max-w-[21cm] mx-auto hidden print:block relative">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { margin: 0; size: A4 portrait; }
          body { margin: 0; padding: 0; background: white; }
          body * { visibility: hidden; }
          #invoice-${order.orderNumber}, #invoice-${order.orderNumber} * { visibility: visible; }
          #invoice-${order.orderNumber} {
            position: absolute; left: 0; top: 0; width: 100%; height: 100%;
            margin: 0; padding: 1.2cm !important; display: block !important; overflow: hidden;
          }
          tr { page-break-inside: avoid; }
        }
      `}} />

      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-4xl font-heading tracking-tighter mb-2">01 LIVING</h1>
          <div className="text-[9px] uppercase tracking-[0.3em] space-y-0.5 font-bold text-primary-anthracite/60">
            <p>De Werf 10, Den Haag</p>
            <p>Luxurious Craftsmanship</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-heading uppercase tracking-widest text-accent-oak mb-1">FACTUUR</h2>
          <div className="space-y-0.5 text-xs font-medium">
            <p>Factuurnummer: <span className="font-bold">#INV-{order.orderNumber}</span></p>
            <p>Datum: {new Date(order.createdAt).toLocaleDateString('nl-NL', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-10 mb-10 border-t border-b border-gray-100 py-8">
        <div>
          <h3 className="text-[9px] uppercase tracking-[0.4em] font-bold text-accent-oak mb-4">Van</h3>
          <div className="text-xs space-y-1.5 leading-relaxed">
            <p className="font-bold text-base">01 Living B.V.</p>
            <p>De Werf 10</p>
            <p>2544 EK Den Haag, Nederland</p>
          </div>
        </div>
        <div>
          <h3 className="text-[9px] uppercase tracking-[0.4em] font-bold text-accent-oak mb-4">Factureren aan</h3>
          <div className="text-xs space-y-1.5 leading-relaxed">
            <p className="font-bold text-base">{order.customerName}</p>
            {order.companyName && <p className="font-bold text-primary-anthracite/80">{order.companyName}</p>}
            <p>{order.billingStreet || order.street} {order.billingHouseNumber || order.houseNumber}{order.billingAddition || order.addition}</p>
            <p>{order.billingPostalCode || order.postalCode} {order.billingCity || order.city}</p>
            <p className="uppercase tracking-widest text-[9px] font-black pt-1">{order.country}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="text-[9px] uppercase tracking-[0.4em] font-bold text-primary-anthracite/40 border-b border-gray-200">
              <th className="py-4 text-left">Omschrijving</th>
              <th className="py-4 text-center w-20">Aantal</th>
              <th className="py-4 text-right w-28">Stukprijs</th>
              <th className="py-4 text-right w-28">Totaal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {order.items.map((item: any) => (
              <tr key={item.id} className="text-xs">
                <td className="py-5 pr-6">
                  <p className="font-bold text-sm mb-0.5">{item.productName}</p>
                  {item.variantName && (
                    <span className="text-[8px] bg-accent-oak/5 text-accent-oak px-1.5 py-0.5 rounded font-bold uppercase tracking-widest italic">
                      {item.variantName}
                    </span>
                  )}
                </td>
                <td className="py-5 text-center font-medium">{item.quantity}</td>
                <td className="py-5 text-right">€{item.price.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</td>
                <td className="py-5 text-right font-bold">€{(item.price * item.quantity).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
            {/* Kargo satırı tabloya eklendi */}
            {shippingGrossTotal > 0 && (
              <tr className="text-xs italic text-primary-anthracite/70">
                <td className="py-4 pr-6 font-medium">Verzendkosten</td>
                <td className="py-4 text-center">1</td>
                <td className="py-4 text-right">€{shippingGrossTotal.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</td>
                <td className="py-4 text-right font-bold">€{shippingGrossTotal.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      <div className="flex justify-between items-start pt-8 border-t-2 border-primary-anthracite">
        <div className="w-1/2 text-[10px] space-y-2 text-primary-anthracite/60 italic leading-relaxed">
          <p>BETAALMETHODE: <span className="text-primary-anthracite font-bold not-italic">iDEAL / Creditcard</span></p>
          <p>STATUS: <span className={`font-bold not-italic ${order.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{order.status.toUpperCase()}</span></p>
        </div>

        <div className="w-1/3 space-y-2.5">
          <div className="flex justify-between text-xs">
            <span className="text-primary-anthracite/60">Subtotaal (Excl. BTW)</span>
            <span className="font-medium">€{subtotalAll.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-xs pb-2 border-b border-gray-100">
            <span className="text-primary-anthracite/60">BTW (21%)</span>
            <span className="font-medium">€{vatAmountAll.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-baseline pt-2">
            <span className="text-xs font-heading uppercase tracking-widest">TOTAAL (Incl. BTW)</span>
            <span className="text-2xl font-heading">€{grandTotal.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-10 left-10 right-10 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4 text-[8px] uppercase tracking-[0.1em] font-bold text-primary-anthracite/40">
        <div>
          <p className="text-accent-oak mb-1">Showroom Den Haag</p>
          <p>De Werf 10, 2544 EK Den Haag</p>
        </div>
        <div className="text-center">
          <p className="text-accent-oak mb-1">Contact</p>
          <p>info@01living.nl</p>
        </div>
        <div className="text-right">
          <p className="text-accent-oak mb-1">Webshop</p>
          <p>www.01living.nl</p>
        </div>
      </div>
    </div>
  );
}
