import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const ComingSoonPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '50px', display: 'flex', justifyContent: 'center' }}>
            <Result
                status="info"
                title="Coming Soon"
                subTitle="Tính năng này đang được phát triển. Vui lòng quay lại sau."
                extra={
                    <Button type="primary" onClick={() => navigate(-1)}>
                        Quay lại
                    </Button>
                }
            />
        </div>
    );
};

export default ComingSoonPage;
