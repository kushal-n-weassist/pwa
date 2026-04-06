import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();

    const response = await fetch('https://ext.digio.in:444/v3/client/kyc/analyze/file/idcard', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic QUlRQ1IyTUc3SVVQUk03RTJGV0JHNTNISkRZS0NXTFk6NFhSM0pMQ1I2TTZSVU4zNUtSMk1XUDRDWTZRN1VOTUc='
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Digio API Proxy Error:', response.status, errorText);
      return NextResponse.json(
        { message: 'Error from Digio API', details: errorText }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('OCR Route Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error forwarding to OCR', error: error.message }, 
      { status: 500 }
    );
  }
}
